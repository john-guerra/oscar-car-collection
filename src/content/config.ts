import { defineCollection, z } from 'astro:content';

const carsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    year: z.number(),
    make: z.string(),
    origin: z.string(),
    type: z.string(),
    manufacturer: z.string(),
    modelNumber: z.string().optional(),
    scale: z.string(),
    madeIn: z.string(),
    material: z.string(),
    productionDate: z.string().optional(),
    series: z.string().optional(),
    wikipediaUrl: z.string().optional(),
    images: z.array(z.string()).default([]),
    publishedDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { cars: carsCollection };
