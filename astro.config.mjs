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
			head: [
				{
					tag: 'meta',
					attrs: {
						property: 'og:image',
						content: 'https://tolearnkorean.com/ToLearnKorean.com-Cover.png',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image:alt',
						content: 'ToLearnKorean.com wordmark and book illustration on a dark panel framed by a teal, purple and pink gradient.',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image:type',
						content: 'image/png',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image:width',
						content: '1600',
					},
				},
				{
					tag: 'meta',
					attrs: {
						property: 'og:image:height',
						content: '900',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:image',
						content: 'https://tolearnkorean.com/ToLearnKorean.com-Cover.png',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:image:alt',
						content: 'ToLearnKorean.com wordmark and book illustration on a dark panel framed by a teal, purple and pink gradient.',
					},
				},
			],
			lastUpdated: true,
			editLink: {
				baseUrl: 'https://github.com/bryanhogan/learnkorean/edit/master/',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/BryanHogan/learnkorean' },
				{ icon: 'email', label: 'Email', href: 'https://bryanhogan.com/socials' },
				{ icon: 'rss', label: 'RSS', href: 'https://tolearnkorean.com/rss.xml' },
			],
			sidebar: [
				{ label: 'Course Contents', link: '/course' },
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
						{ label: 'Sentence Structure', slug: 'chapter/sentence-structure' },
					],
				},
				{
					label: 'Blog',
					items: [
						{ label: 'Overview', slug: 'blog' },
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
