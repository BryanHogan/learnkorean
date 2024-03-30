import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
    const chapters = await getCollection('chapters');
    return rss({
        title: "ToLearnKorean",
        description: "Your helper to learn Korean.",
        site: context.site,
        stylesheet: '/styles.xsl',
        items: chapters.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
            // Compute RSS link from post `slug`
            // This example assumes all posts are rendered as `/blog/[slug]` routes
            link: `/unit-1/${post.slug}/`,
        })),
    });
}