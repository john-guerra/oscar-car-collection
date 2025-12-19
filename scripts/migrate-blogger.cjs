#!/usr/bin/env node

/**
 * Blogger to Astro Migration Script
 *
 * Parses Blogger Atom XML export and generates Astro markdown content files.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const EXPORT_ZIP = path.join(__dirname, '../blogger_export/takeout-20251219T032213Z-3-001.zip');
const FEED_PATH = 'Takeout/Blogger/Blogs/Oscar_s Classic Model Cars Collection/feed.atom';
const OUTPUT_DIR = path.join(__dirname, '../src/content/cars');
const IMAGES_DIR = path.join(__dirname, '../public/images/cars');

// Ensure output directories exist
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(IMAGES_DIR, { recursive: true });

// Extract the Atom feed from the ZIP
console.log('Extracting Blogger feed...');
const feedContent = execSync(`unzip -p "${EXPORT_ZIP}" "${FEED_PATH}"`, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });

// Parse XML manually (avoiding external dependencies)
function extractBetween(text, startTag, endTag, startIndex = 0) {
  const start = text.indexOf(startTag, startIndex);
  if (start === -1) return { value: null, endIndex: -1 };
  const valueStart = start + startTag.length;
  const end = text.indexOf(endTag, valueStart);
  if (end === -1) return { value: null, endIndex: -1 };
  return { value: text.substring(valueStart, end), endIndex: end + endTag.length };
}

function extractAllEntries(feedXml) {
  const entries = [];
  let searchIndex = 0;

  while (true) {
    const entryStart = feedXml.indexOf('<entry>', searchIndex);
    if (entryStart === -1) break;

    const entryEnd = feedXml.indexOf('</entry>', entryStart);
    if (entryEnd === -1) break;

    const entryXml = feedXml.substring(entryStart, entryEnd + 8);
    entries.push(entryXml);
    searchIndex = entryEnd + 8;
  }

  return entries;
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function parseEntry(entryXml) {
  // Check if this is a POST (not a COMMENT)
  if (!entryXml.includes('<blogger:type>POST</blogger:type>')) {
    return null;
  }

  // Check if LIVE (not draft/deleted)
  if (!entryXml.includes('<blogger:status>LIVE</blogger:status>')) {
    return null;
  }

  // Extract title
  const titleMatch = extractBetween(entryXml, '<title>', '</title>');
  const title = titleMatch.value || 'Untitled';

  // Extract content
  const contentMatch = extractBetween(entryXml, "<content type='html'>", '</content>');
  const rawContent = contentMatch.value ? decodeHtmlEntities(contentMatch.value) : '';

  // Extract published date
  const publishedMatch = extractBetween(entryXml, '<published>', '</published>');
  const publishedDate = publishedMatch.value || new Date().toISOString();

  // Extract categories/tags
  const tags = [];
  let tagIndex = 0;
  while (true) {
    const termStart = entryXml.indexOf(" term='", tagIndex);
    if (termStart === -1) break;
    const termValueStart = termStart + 7;
    const termEnd = entryXml.indexOf("'", termValueStart);
    if (termEnd === -1) break;
    tags.push(entryXml.substring(termValueStart, termEnd));
    tagIndex = termEnd + 1;
  }

  // Parse structured data from HTML content
  const data = parseCarData(rawContent, title, tags);
  data.publishedDate = publishedDate.split('T')[0]; // Just the date part
  data.tags = tags;

  // Extract image URLs
  const images = extractImageUrls(rawContent);
  data.images = images;

  return data;
}

function parseCarData(html, title, tags) {
  const data = {
    name: title,
    year: 0,
    make: '',
    origin: '',
    type: 'Unknown',
    manufacturer: '',
    modelNumber: '',
    scale: '1:43',
    madeIn: '',
    material: 'Diecast',
    productionDate: '',
    series: '',
    wikipediaUrl: '',
  };

  // Extract year from title (e.g., "1898 Renault" -> 1898)
  const yearMatch = title.match(/^(\d{4})/);
  if (yearMatch) {
    data.year = parseInt(yearMatch[1], 10);
  }

  // Parse structured fields from HTML
  // Make/Model name
  const makeMatch = html.match(/<strong>Make:?<\/strong>\s*(.+?)(?:<br|$)/i);
  if (makeMatch) {
    data.make = cleanText(makeMatch[1]);
  } else {
    // Use title without year as make
    data.make = title.replace(/^\d{4}s?\+?\s*/, '').trim();
  }

  // Year (if not from title)
  if (data.year === 0) {
    const yearContentMatch = html.match(/<strong>Year:?<\/strong>\s*(\d{4})/i);
    if (yearContentMatch) {
      data.year = parseInt(yearContentMatch[1], 10);
    }
  }

  // Origin/Country
  const originMatch = html.match(/<strong>Origin:?<\/strong>\s*(.+?)(?:<br|$)/i);
  if (originMatch) {
    data.origin = cleanText(originMatch[1]);
  }

  // Type
  const typeMatch = html.match(/<strong>Type:?<\/strong>\s*(.+?)(?:<br|$)/i);
  if (typeMatch) {
    data.type = cleanText(typeMatch[1]);
  }

  // Manufacturer
  const manufacturerMatch = html.match(/<strong>Manufacturer:?<\/strong>\s*(.+?)(?:<br|$)/i);
  if (manufacturerMatch) {
    data.manufacturer = cleanText(manufacturerMatch[1]);
  }

  // Scale
  const scaleMatch = html.match(/<strong>Scale:?<\/strong>\s*(.+?)(?:<br|$)/i);
  if (scaleMatch) {
    data.scale = cleanText(scaleMatch[1]);
  }

  // Made in
  const madeInMatch = html.match(/<strong>Made in:?<\/strong>\s*(.+?)(?:<br|$)/i);
  if (madeInMatch) {
    data.madeIn = cleanText(madeInMatch[1]);
  }

  // Material
  const materialMatch = html.match(/<strong>Material:?<\/strong>\s*(.+?)(?:<br|$)/i);
  if (materialMatch) {
    data.material = cleanText(materialMatch[1]);
  }

  // Series
  const seriesMatch = html.match(/<strong>Series:?<\/strong>\s*(.+?)(?:<br|$)/i);
  if (seriesMatch) {
    data.series = cleanText(seriesMatch[1]);
  }

  // Production Date
  const prodDateMatch = html.match(/<strong>Production Date:?<\/strong>\s*(.+?)(?:<br|$)/i);
  if (prodDateMatch) {
    data.productionDate = cleanText(prodDateMatch[1]);
  }

  // Wikipedia URL
  const wikiMatch = html.match(/href="(https?:\/\/[^"]*wikipedia[^"]*)"/i);
  if (wikiMatch) {
    data.wikipediaUrl = wikiMatch[1];
  }

  return data;
}

function extractImageUrls(html) {
  const images = [];
  const imgRegex = /src="(https:\/\/blogger\.googleusercontent\.com[^"]+)"/g;
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    // Get the larger version of the image (s1600 instead of s320)
    let imgUrl = match[1];
    imgUrl = imgUrl.replace(/\/s\d+\//, '/s1600/');
    if (!images.includes(imgUrl)) {
      images.push(imgUrl);
    }
  }

  return images;
}

function cleanText(text) {
  return text
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

function generateMarkdown(car) {
  const frontmatter = {
    name: car.name,
    year: car.year || 1900,
    make: car.make || car.name,
    origin: car.origin || 'Unknown',
    type: car.type || 'Unknown',
    manufacturer: car.manufacturer || 'Unknown',
    scale: car.scale || '1:43',
    madeIn: car.madeIn || 'Unknown',
    material: car.material || 'Diecast',
    images: car.images || [],
    publishedDate: car.publishedDate,
    tags: car.tags || [],
  };

  // Add optional fields only if they have values
  if (car.modelNumber) frontmatter.modelNumber = car.modelNumber;
  if (car.productionDate) frontmatter.productionDate = car.productionDate;
  if (car.series) frontmatter.series = car.series;
  if (car.wikipediaUrl) frontmatter.wikipediaUrl = car.wikipediaUrl;

  // Create YAML frontmatter
  let yaml = '---\n';
  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        yaml += `${key}: []\n`;
      } else {
        yaml += `${key}:\n`;
        for (const item of value) {
          yaml += `  - "${item.replace(/"/g, '\\"')}"\n`;
        }
      }
    } else if (typeof value === 'number') {
      yaml += `${key}: ${value}\n`;
    } else {
      // Escape quotes in strings
      const escapedValue = String(value).replace(/"/g, '\\"');
      yaml += `${key}: "${escapedValue}"\n`;
    }
  }
  yaml += '---\n';

  return yaml;
}

// Main execution
console.log('Parsing Blogger entries...');
const entries = extractAllEntries(feedContent);
console.log(`Found ${entries.length} total entries`);

let postsCount = 0;
let skippedCount = 0;
const cars = [];

for (const entryXml of entries) {
  const car = parseEntry(entryXml);
  if (car) {
    cars.push(car);
    postsCount++;
  } else {
    skippedCount++;
  }
}

console.log(`Parsed ${postsCount} car posts (skipped ${skippedCount} comments/drafts)`);

// Generate markdown files
console.log('Generating markdown files...');
for (const car of cars) {
  const slug = slugify(car.name);
  const filename = `${slug}.md`;
  const filepath = path.join(OUTPUT_DIR, filename);

  const markdown = generateMarkdown(car);
  fs.writeFileSync(filepath, markdown);
}

console.log(`\nMigration complete!`);
console.log(`Generated ${cars.length} car markdown files in ${OUTPUT_DIR}`);
console.log(`\nNote: Images are still referenced from Blogger CDN.`);
console.log(`To download images locally, run: node scripts/download-images.js`);
