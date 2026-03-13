import { defineCollection, z } from 'astro:content';

const clubs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    city: z.string(),
    country: z.string(),
    tags: z.array(z.string()).default([]),
    visited: z.boolean().default(false),
    djmagRank: z.number().optional(),
    djmagYear: z.number().optional(),
  }),
});

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
  }),
});

export const collections = {
  clubs,
  articles,
};
