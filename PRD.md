# Product Requirements Document (PRD)
## Oscar's Classic Model Cars Collection Website

**Version:** 1.0
**Last Updated:** December 2024
**Status:** Released

---

## 1. Overview

### 1.1 Product Summary
A modern, responsive website to showcase Oscar's Classic Model Cars Collection - a curated collection of scale model cars representing vehicles primarily from the pre-1960 era. The website serves as a digital catalog and showcase for approximately 700 model cars collected over 30 years.

### 1.2 Objectives
- Provide an elegant, user-friendly platform to browse the model car collection
- Enable visitors to search, filter, and explore models by various criteria
- Showcase detailed information about each model including manufacturer, scale, and historical context
- Create a responsive experience that works across desktop, tablet, and mobile devices

### 1.3 Target Audience
- Model car collectors and enthusiasts
- Automotive history buffs
- Visitors interested in vintage and classic automobiles
- Potential traders or buyers seeking specific models

---

## 2. Functional Requirements

### 2.1 Collection Display

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-001 | Display model cars in a responsive grid layout | High |
| FR-002 | Show car cards with image/icon, year, name, type, and key details | High |
| FR-003 | Support click-to-expand modal with full model specifications | High |
| FR-004 | Display collection statistics (total models, manufacturers) | Medium |

### 2.2 Search Functionality

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-005 | Real-time search across car name, manufacturer, year, type, country | High |
| FR-006 | Search should include model descriptions | Medium |
| FR-007 | Debounced search input (300ms delay) for performance | Medium |
| FR-008 | Display "no results" message when search yields no matches | High |

### 2.3 Filtering System

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-009 | Filter by manufacturer (dropdown with all available manufacturers) | High |
| FR-010 | Filter by scale (1:43, 1:55, etc.) | High |
| FR-011 | Filter by vehicle type (Touring, Racing, Saloon, etc.) | High |
| FR-012 | Filter by era/decade (1900s, 1910s, 1920s, etc.) | Medium |
| FR-013 | Combine multiple filters simultaneously | High |
| FR-014 | Clear all filters with single action | Medium |

### 2.4 Sorting Options

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-015 | Sort by year (oldest first) | High |
| FR-016 | Sort by year (newest first) | High |
| FR-017 | Sort by name (A-Z) | Medium |
| FR-018 | Sort by name (Z-A) | Medium |
| FR-019 | Sort by manufacturer | Medium |

### 2.5 Model Detail View

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-020 | Display full model name and year | High |
| FR-021 | Show vehicle type and country of origin | High |
| FR-022 | Display manufacturer and model number | High |
| FR-023 | Show scale and production date | High |
| FR-024 | Display manufacturing country and material | High |
| FR-025 | Show series information (if applicable) | Medium |
| FR-026 | Include historical description of the vehicle | Medium |
| FR-027 | Modal closes on backdrop click or Escape key | Medium |

### 2.6 Theme Support

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-028 | Support light and dark color themes | Medium |
| FR-029 | Theme toggle button in navigation | Medium |
| FR-030 | Persist theme preference in localStorage | Low |
| FR-031 | Detect system color scheme preference | Low |

### 2.7 Statistics Dashboard

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-032 | Display breakdown by manufacturer (top 5) | Low |
| FR-033 | Display breakdown by scale (top 5) | Low |
| FR-034 | Display breakdown by material (top 5) | Low |
| FR-035 | Display breakdown by country of origin (top 5) | Low |
| FR-036 | Animated progress bars for visual representation | Low |

---

## 3. Non-Functional Requirements

### 3.1 Performance

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-001 | Page load time < 3 seconds on 3G connection | High |
| NFR-002 | Smooth scrolling and animations at 60fps | Medium |
| NFR-003 | Search/filter results update within 100ms | High |

### 3.2 Compatibility

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-004 | Support modern browsers (Chrome, Firefox, Safari, Edge) | High |
| NFR-005 | Responsive design for screens 320px to 2560px width | High |
| NFR-006 | Touch-friendly interface for mobile devices | High |
| NFR-007 | No JavaScript framework dependencies (vanilla JS) | Medium |

### 3.3 Accessibility

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-008 | Semantic HTML structure | Medium |
| NFR-009 | ARIA labels on interactive elements | Medium |
| NFR-010 | Keyboard navigation support | Medium |
| NFR-011 | Sufficient color contrast ratios | Medium |

### 3.4 Maintainability

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-012 | Modular code structure (separate HTML, CSS, JS, data) | High |
| NFR-013 | Car data stored in separate JavaScript file for easy updates | High |
| NFR-014 | CSS custom properties for theming | Medium |
| NFR-015 | Commented code for complex logic | Low |

---

## 4. Data Model

### 4.1 Car Object Schema

```javascript
{
  id: Number,              // Unique identifier
  name: String,            // Model name (e.g., "Rolls Royce Silver Ghost")
  year: Number,            // Year of original vehicle (e.g., 1907)
  country: String,         // Country of original vehicle (e.g., "England")
  type: String,            // Vehicle type (e.g., "Touring", "Racing")
  manufacturer: String,    // Model manufacturer (e.g., "Matchbox")
  modelNumber: String,     // Catalog number (e.g., "Y-10-1")
  productionDate: String,  // When model was produced (e.g., "1958-1959")
  scale: String,           // Model scale (e.g., "1:43")
  madeIn: String,          // Manufacturing country (e.g., "England")
  material: String,        // Material (e.g., "Diecast", "White Metal")
  series: String,          // Optional series name
  icon: String,            // Emoji representation
  description: String      // Historical context and details
}
```

### 4.2 Supported Manufacturers
- Matchbox (Models of Yesteryear)
- Lansdowne
- Gowland & Gowland
- Dinky
- Corgi
- Franklin Mint

### 4.3 Supported Vehicle Types
- Touring
- Racing
- Saloon
- Coupe
- Sports
- Roadster
- Limousine
- Truck
- Bus
- Van
- Locomotive
- Tramcar
- Fire Engine
- Traction Engine
- Horse-Drawn Bus

---

## 5. User Interface Specifications

### 5.1 Layout Structure

```
+------------------------------------------+
|  HEADER (Logo, Navigation, Theme Toggle) |
+------------------------------------------+
|                                          |
|              HERO SECTION                |
|     (Title, Description, Stats, CTA)     |
|                                          |
+------------------------------------------+
|           COLLECTION SECTION             |
|  +------------------------------------+  |
|  |  Search Box                        |  |
|  +------------------------------------+  |
|  |  Filters (Mfr, Scale, Type, Era)   |  |
|  +------------------------------------+  |
|  |  Results Count                     |  |
|  +------------------------------------+  |
|  |  +------+  +------+  +------+      |  |
|  |  | Card |  | Card |  | Card |      |  |
|  |  +------+  +------+  +------+      |  |
|  |  +------+  +------+  +------+      |  |
|  |  | Card |  | Card |  | Card |      |  |
|  |  +------+  +------+  +------+      |  |
|  +------------------------------------+  |
+------------------------------------------+
|             ABOUT SECTION                |
+------------------------------------------+
|           STATISTICS SECTION             |
+------------------------------------------+
|                FOOTER                    |
+------------------------------------------+
```

### 5.2 Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 480px | Single column grid, stacked filters |
| Tablet | 480px - 768px | 2-column grid, 2-column filters |
| Desktop | > 768px | 3+ column grid, inline filters, full nav |

### 5.3 Color Palette

#### Light Theme
| Element | Color |
|---------|-------|
| Primary | #8B4513 (Saddle Brown) |
| Accent | #C9A227 (Gold) |
| Background | #faf9f7 |
| Card Background | #ffffff |
| Text Primary | #1a1a1a |
| Text Secondary | #555555 |

#### Dark Theme
| Element | Color |
|---------|-------|
| Primary | #D4A574 (Light Brown) |
| Accent | #E8C547 (Light Gold) |
| Background | #121212 |
| Card Background | #252525 |
| Text Primary | #f0f0f0 |
| Text Secondary | #b0b0b0 |

---

## 6. Technical Architecture

### 6.1 File Structure

```
oscar-car-collection/
├── index.html      # Main HTML document
├── styles.css      # All CSS styles with theme support
├── app.js          # Application logic and interactivity
├── cars.js         # Model car data collection
└── PRD.md          # This document
```

### 6.2 Dependencies
- **Google Fonts:** Playfair Display, Inter
- **No JavaScript frameworks** - Pure vanilla JavaScript
- **No build tools required** - Static files only

### 6.3 Browser Storage
- `localStorage.theme` - Stores user's theme preference ("light" or "dark")

---

## 7. Future Enhancements (Backlog)

| ID | Enhancement | Description |
|----|-------------|-------------|
| FE-001 | Image Gallery | Add actual photographs of each model |
| FE-002 | Favorites | Allow users to mark favorite models |
| FE-003 | Comparison | Side-by-side model comparison feature |
| FE-004 | Print View | Optimized layout for printing collection |
| FE-005 | Export | Export filtered results as PDF or CSV |
| FE-006 | Comments | Allow visitors to leave comments |
| FE-007 | Similar Models | Show related models in detail view |
| FE-008 | Timeline View | Chronological timeline visualization |
| FE-009 | Map View | Show models by country of origin on map |
| FE-010 | Full 700 Models | Complete migration of all collection items |

---

## 8. Success Metrics

| Metric | Target |
|--------|--------|
| Page Load Time | < 2 seconds |
| Mobile Usability Score | > 90 (Lighthouse) |
| Accessibility Score | > 85 (Lighthouse) |
| Models Displayed | 50+ (Phase 1), 700 (Phase 2) |
| Browser Compatibility | 4 major browsers |

---

## 9. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 2024 | Claude | Initial PRD release |
