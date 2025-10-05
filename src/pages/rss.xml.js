import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('posts');
  return rss({
    title: 'AI Art Advancements',
    description: 'Stay updated with advancements in AI-generated art.',
    site: import.meta.env.SITE,
    items: posts.map((post) => ({
      link: import.meta.env.BASE_URL + 'blog/' + post.slug + '/',
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.date),
    })),
  });
}
