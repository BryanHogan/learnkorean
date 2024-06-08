import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
    const chapters = await getCollection('chapters');
    const posts = await getCollection('posts'); // Fetch posts collection

    // Combine both collections into a single array
    const items = [
        ...chapters.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
            // rendered as `/unit-1/[slug]` routes, this will have to get changed in the future!
            link: `/unit-${post.data.unit}/${post.slug}`,
        })),
        ...posts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
            link: `/posts/${post.slug}`, // Adjust the link structure as needed
        })),
    ];

    // Sort the combined items by publication date in descending order
    items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    return rss({
        title: "ToLearnKorean",
        description: "Your helper to learn Korean.",
        site: context.site,
        stylesheet: '/styles.xsl',
        items, // Use the combined items array
    });
}