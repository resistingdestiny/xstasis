import { getCollection } from 'astro:content';
import { parseRunFile } from '../lib/run-parser';
import path from 'path';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const clubs = await getCollection('clubs');
  const articles = await getCollection('articles');

  const runFilePath = path.join(process.cwd(), 'src/content/run/the-run.mdx');
  const runEntries = parseRunFile(runFilePath);

  const searchIndex = [
    ...clubs.map((club) => ({
      type: 'club',
      title: club.data.title,
      url: `/clubs/${club.slug}`,
      excerpt: `${club.data.city}, ${club.data.country}`,
      tags: club.data.tags,
      content: club.body.substring(0, 500),
    })),
    ...articles.map((article) => ({
      type: 'article',
      title: article.data.title,
      url: `/articles/${article.slug}`,
      excerpt: article.data.summary,
      tags: article.data.tags,
      content: article.body.substring(0, 500),
    })),
    ...runEntries.map((entry) => ({
      type: 'run',
      title: `${entry.club} - ${entry.date}`,
      url: `/run#${entry.id}`,
      excerpt: `${entry.city}, ${entry.country}`,
      tags: [],
      content: entry.note,
    })),
  ];

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
