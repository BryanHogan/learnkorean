import { z, defineCollection } from 'astro:content';

const chapterCollection = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string().max(60, "Maximum of 60 characters in title required.").min(10, "Minimum of 10 characters in title required."),
        author: z.string(),
        description: z.string().max(162, "Maximum of 162 characters in description required.").min(50, "Minimum of 50 characters in description required."),
        cover: image()
            .refine((img) => img.width = 1600, {
                message: "Cover image must be 1600 pixel wide!",
            })
            .refine((img) => img.height = 900, {
                message: "Cover image must be 900 pixel high!",
            }),
        coverAlt: z.string(),
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
        coverUrl: image().refine((img) => img.width >= 10, {
            message: "Cover image must be at least 10 pixels wide!",
        }),
        coverAlt: z.string(),
        pubDate: z.date(),
        lastUpdate: z.date(),
        unit: z.number(),
        sortOrder: z.number(),
        tags: z.array(z.string()),
    })
});

export const collections = {
    'chapters': chapterCollection,
    'posts': postCollection,
};