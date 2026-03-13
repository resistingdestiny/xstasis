import { getCollection } from 'astro:content';
import { parseRunFile } from './run-parser';
import path from 'path';

export interface WikiLink {
  text: string;
  slug: string;
  exists: boolean;
  type?: 'club' | 'article';
}

export interface Backlink {
  title: string;
  slug: string;
  type: 'club' | 'article' | 'run';
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export function parseWikiLinks(content: string): WikiLink[] {
  const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;
  const links: WikiLink[] = [];
  let match;

  while ((match = wikiLinkRegex.exec(content)) !== null) {
    const text = match[1];
    const slug = slugify(text);
    links.push({ text, slug, exists: false });
  }

  return links;
}

export async function resolveWikiLinks(content: string): Promise<WikiLink[]> {
  const links = parseWikiLinks(content);
  const clubs = await getCollection('clubs');
  const articles = await getCollection('articles');

  const clubSlugs = new Set(clubs.map((club) => club.slug));
  const articleSlugs = new Set(articles.map((article) => article.slug));

  return links.map((link) => {
    const isClub = clubSlugs.has(link.slug);
    const isArticle = articleSlugs.has(link.slug);
    return {
      ...link,
      exists: isClub || isArticle,
      type: isClub ? 'club' as const : isArticle ? 'article' as const : undefined,
    };
  });
}

export function replaceWikiLinks(content: string, resolvedLinks: WikiLink[]): string {
  const linkMap = new Map(resolvedLinks.map((link) => [link.text, link]));

  return content.replace(/\[\[([^\]]+)\]\]/g, (match, text) => {
    const link = linkMap.get(text);
    if (!link) return match;

    if (link.exists) {
      const prefix = link.type === 'article' ? '/articles' : '/clubs';
      return `<a href="${prefix}/${link.slug}" class="wiki-link">${text}</a>`;
    } else {
      return `<a href="/clubs?search=${encodeURIComponent(text)}" class="wiki-link wiki-link-missing" title="Page does not exist">${text}</a>`;
    }
  });
}

export async function getBacklinks(targetSlug: string): Promise<Backlink[]> {
  const clubs = await getCollection('clubs');
  const articles = await getCollection('articles');
  const backlinks: Backlink[] = [];

  for (const club of clubs) {
    if (club.slug === targetSlug) continue;
    const content = club.body;
    const links = parseWikiLinks(content);
    if (links.some((link) => link.slug === targetSlug)) {
      backlinks.push({
        title: club.data.title,
        slug: club.slug,
        type: 'club',
      });
    }
  }

  for (const article of articles) {
    const content = article.body;
    const links = parseWikiLinks(content);
    if (links.some((link) => link.slug === targetSlug)) {
      backlinks.push({
        title: article.data.title,
        slug: article.slug,
        type: 'article',
      });
    }
  }

  // Scan run entries for backlinks
  const runFilePath = path.join(process.cwd(), 'src/content/run/the-run.mdx');
  const runEntries = parseRunFile(runFilePath);
  for (const entry of runEntries) {
    const links = parseWikiLinks(entry.content);
    if (links.some((link) => link.slug === targetSlug)) {
      backlinks.push({
        title: `${entry.club} — ${entry.date}`,
        slug: entry.id,
        type: 'run',
      });
    }
  }

  return backlinks;
}

export async function getRelatedClubs(tags: string[], currentSlug: string) {
  const clubs = await getCollection('clubs');

  return clubs
    .filter((club) => club.slug !== currentSlug)
    .map((club) => {
      const sharedTags = club.data.tags.filter((tag) => tags.includes(tag));
      return { club, score: sharedTags.length };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((item) => item.club);
}
