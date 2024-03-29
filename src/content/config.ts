import { z, defineCollection } from 'astro:content';

const chapterCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string().max(60, "Maximum of 60 characters in title required.").min(10, "Minimum of 10 characters in title required."),
        author: z.string(),
        description: z.string().max(162, "Maximum of 162 characters in description required.").min(50, "Minimum of 50 characters in description required."),
        cover: z.object({
            url: z.string(),
            alt: z.string(),
        }),
        pubDate: z.date(),
        lastUpdate: z.date(),
        unit: z.number(),
        sortOrder: z.number(),
        tags: z.array(z.string()),
    })
});
const postCollection = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string().max(60, "Maximum of 60 characters in title required.").min(10, "Minimum of 10 characters in title required."),
        author: z.string(),
        description: z.string().max(162, "Maximum of 162 characters in description required.").min(50, "Minimum of 50 characters in description required."),
        cover: z.object({
            url: image().refine((img) => img.width >= 1080, {
                message: "Too small",
            }),
            alt: z.string(),
        }),
        pubDate: z.date(),
        lastUpdate: z.date(),
        tags: z.array(z.string()),
    })
});

export const collections = {
    'chapters': chapterCollection,
    'posts': postCollection,
  };