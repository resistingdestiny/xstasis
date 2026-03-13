import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = await getCollection('articles');
  const sortedArticles = articles.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'xstasis',
    description: 'A moving archive of dancefloors. Trance-leaning travel and club journal.',
    site: context.site || 'https://xstasis.org',
    items: sortedArticles.map((article) => ({
      title: article.data.title,
      description: article.data.summary,
      pubDate: article.data.date,
      link: `/articles/${article.slug}/`,
      categories: article.data.tags,
    })),
    customData: '<language>en-us</language>',
  });
}
