import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader({
			generateId: ({ entry, data }) => {
				if (typeof data.slug === 'string') return data.slug;

				return entry
					.replace(/\\/g, '/')
					.replace(/\.[^.]+$/, '')
					.replace(/^chapter\/\d+\//, 'chapter/')
					.replace(/\/index$/, '');
			},
		}),
		schema: docsSchema(),
	}),
};
