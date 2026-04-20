// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://tolearnkorean.com',
	integrations: [
		starlight({
			title: 'To Learn Korean',
			logo: {
				light: './src/assets/ToLearnKorean-Logo-Dark.svg',
				dark: './src/assets/ToLearnKorean-Logo.svg',
			},
			customCss: [
				'./src/styles/custom.css',
			],
			lastUpdated: true,
			editLink: {
				baseUrl: 'https://github.com/bryanhogan/learnkorean/edit/master/',
			},
			social: {
				github: 'https://github.com/BryanHogan/learnkorean',
				email: 'https://bryanhogan.com/socials',
				rss: 'https://tolearnkorean.com/rss.xml'
			},
			sidebar: [
				{ label: 'Introduction', link: 'chapter/introduction' },
				{
					label: 'Unit 0',
					items: [
						{ label: 'Korean Alphabet: Hangul', slug: 'chapter/korean-alphabet-hangul' },
						{ label: 'Strong Consonants', slug: 'chapter/strong-consonants-hangul' },
						{ label: 'Double Consonants', slug: 'chapter/double-consonants-hangul' },
						{ label: 'Diphthongs', slug: 'chapter/diphthongs' },
						{ label: 'Basic Words', slug: 'chapter/basic-words' },
						{ label: 'Further Reading & Practice', slug: 'chapter/unit-0-completed' },
					],
				},
				{
					label: 'Unit 1',
					items: [
						{ label: 'Unit 1 Introduction', slug: 'chapter/unit-1-introduction' },
						{ label: 'Sentence Structure', slug: 'chapter/sentence-structure' },
					],
				},
				{
					label: 'Blog',
					items: [
						{ label: 'Overview', slug: 'blog/overview' },
						{ label: 'How to Anki', slug: 'blog/how-to-anki' },
						{ label: 'Launch', slug: 'blog/launch' },
					],
				},
				{
					label: 'Miscellaneous',
					items: [
						{ label: 'About', slug: 'about' },
					],
				},
			],
		}),
	],
});
