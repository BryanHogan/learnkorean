import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
    const chapters = await getCollection('chapters');
    const posts = await getCollection('posts');

    const items = [
        ...chapters.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
            link: `/unit-${post.data.unit}/${post.slug}`,
        })),
        ...posts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
            link: `/blog/${post.slug}`,
        })),
    ];

    items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    return rss({
        title: "ToLearnKorean",
        description: "Your helper to learn Korean.",
        site: context.site,
        stylesheet: '/styles.xsl',
        items,
    });
}