// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { satteri } from '@astrojs/markdown-satteri';
import sentencePlugin from './src/plugins/satteri-sentence.mjs';
import pelePlugin from './src/plugins/satteri-pele.mjs';
import koreanPlugin from './src/plugins/satteri-korean.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://tolearnkorean.com',
	markdown: {
		// Sätteri 0.9 requires raw HTML replacements before MDX import insertion.
		processor: satteri({ mdastPlugins: [pelePlugin, koreanPlugin, sentencePlugin] }),
	},
	integrations: [
		starlight({
			title: 'To Learn Korean',
			logo: {
				src: './src/assets/Tiger-16x-Sitting.svg',
			},
			customCss: [
				'./src/styles/custom.css',
			],
			head: [
				{
					tag: 'link',
					attrs: {
						rel: 'icon',
						href: '/favicon.ico',
						sizes: '32x32',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'apple-touch-icon',
						href: '/apple-touch-icon.png',
					},
				},
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
				{ label: 'Course Contents', link: '/chapters' },
				{
					label: 'Unit 0',
					items: [
						{ label: 'Korean alphabet: Hangul', slug: 'chapter/korean-alphabet-hangul' },
						{ label: 'Strong consonants', slug: 'chapter/strong-consonants-hangul' },
						{ label: 'Double consonants', slug: 'chapter/double-consonants-hangul' },
						{ label: 'Y vowels', slug: 'chapter/y-vowels' },
						{ label: 'Diphthongs', slug: 'chapter/diphthongs' },
						{ label: 'Basic words', slug: 'chapter/basic-words' },
						{ label: 'Further reading and practice', slug: 'chapter/unit-0-completed' },
					],
				},
				{
					label: 'Unit 1',
					items: [
						{ label: 'Sentence structure', slug: 'chapter/sentence-structure' },
						{ label: 'Hello and goodbye', slug: 'chapter/basic-greetings-and-goodbye' },
						{ label: 'Something is: 이다', slug: 'chapter/something-is' },
					],
				},
				{
					label: 'Unit 2',
					items: [
						{ label: 'Casual speech: 반말', slug: 'chapter/casual-speech' },
						{ label: 'Formal polite speech', slug: 'chapter/formal-polite-speech' },
						{ label: 'Making suggestions', slug: 'chapter/making-suggestions' },
						{ label: 'Adverbs', slug: 'chapter/adverbs'},
					],
				},
				{
					label: 'Unit 3',
					items: [
						{ label: 'Only: 만 and 밖에', slug: 'chapter/only' },
						{ label: 'Becoming: 되다', slug: 'chapter/becoming-something' },
						{ label: 'Like this or that', slug: 'chapter/being-this-way-or-that-way' },
						{ label: 'Toward: (으)로', slug: 'chapter/toward' },
						{ label: 'Using: (으)로', slug: 'chapter/using-things' },
						{ label: 'Verbs as nouns', slug: 'chapter/describing-verbs' },
						{ label: 'Giving a reason', slug: 'chapter/giving-a-reason' },
						{ label: 'Contrast: 데', slug: 'chapter/showing-contrast' },
						{ label: 'If and when', slug: 'chapter/if-and-when' },
						{ label: 'Could it be?', slug: 'chapter/could-it-be' },
						{ label: 'Before and after', slug: 'chapter/before-and-after' },
						{ label: 'Or', slug: 'chapter/or' },
						{ label: 'Negative commands', slug: 'chapter/negative-commands' },
						{ label: 'Hopes and wishes', slug: 'chapter/hope-and-wish-for' },
						{ label: 'Cannot', slug: 'chapter/cannot'},
						{ label: 'To try', slug: 'chapter/to-try'},
						{ label: "Should and shouldn't", slug: 'chapter/should-and-shouldnt'},
						{ label: 'Surprise: 네요', slug: 'chapter/expressing-surprise' },
						{ label: 'Agreement: 죠', slug: 'chapter/wanting-agreement' },
						{ label: 'Curiosity: 나요 and 가요', slug: 'chapter/expressing-curiosity' },
						{ label: 'Realization: 군요', slug: 'chapter/expressing-realization' },
						{ label: 'Plain form', slug: 'chapters', badge: { text: 'w.i.p.', variant: 'caution' }, },
						{ label: 'Quoting', slug: 'chapter/quotes' },
						{ label: 'Doing a favor', slug: 'chapters', badge: { text: 'w.i.p.', variant: 'caution' }, },
						{ label: 'I think', slug: 'chapters', badge: { text: 'w.i.p.', variant: 'caution' }, },
						{ label: 'Have to do', slug: 'chapters', badge: { text: 'w.i.p.', variant: 'caution' }, },
						{ label: 'In order to and for someone', slug: 'chapters', badge: { text: 'w.i.p.', variant: 'caution' }, },
						{ label: 'While', slug: 'chapters', badge: { text: 'w.i.p.', variant: 'caution' }, },
						{ label: 'Making a phone call', slug: 'chapters', badge: { text: 'w.i.p.', variant: 'caution' }, },
						{ label: 'At the restaurant', slug: 'chapters', badge: { text: 'w.i.p.', variant: 'caution' }, },
						{ label: 'Going shopping', slug: 'chapters', badge: { text: 'w.i.p.', variant: 'caution' }, },
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
