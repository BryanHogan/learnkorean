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
            // rendered as `/uint-1/[slug]` routes, this will have to get changed in the future!
            link: `/unit-1/${post.slug}/`,
        })),
    });
}