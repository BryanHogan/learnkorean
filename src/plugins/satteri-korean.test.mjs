import assert from 'node:assert/strict';
import test from 'node:test';
import { renderJSX } from 'astro/runtime/server/index.js';
import { markdownToHtml, mdxToJs } from 'satteri';
import koreanPlugin from './satteri-korean.mjs';
import pelePlugin from './satteri-pele.mjs';
import sentencePlugin from './satteri-sentence.mjs';

const fileURL = new URL('../content/docs/chapter/3/example.mdx', import.meta.url);
const options = { fileURL, mdastPlugins: [koreanPlugin], jsxImportSource: 'astro' };

async function mdxToHtml(source, compileOptions = options) {
	const { code } = await mdxToJs(source, compileOptions);
	// Resolve the runtime before importing the compiled module from memory.
	const executable = code.replace('"astro/jsx-runtime"', JSON.stringify(import.meta.resolve('astro/jsx-runtime')));
	const { default: Content } = await import(`data:text/javascript;base64,${Buffer.from(executable).toString('base64')}`);
	return String(await renderJSX({}, Content()));
}

for (const [format, compile] of [
	['Markdown', async (source) => (await markdownToHtml(source, options)).html],
	['MDX', mdxToHtml],
]) {
	test(`${format}: renders Korean-only inline code as a Korean term`, async () => {
		const html = await compile('Use `나` instead of `저`, or the `(을/ㄹ)까요` and `-았/었으면 좋겠다` forms.');
		for (const term of ['나', '저', '(을/ㄹ)까요', '-았/었으면 좋겠다']) {
			assert.ok(html.includes(`<span lang="ko" class="ko-term">${term}</span>`), term);
		}
		assert.doesNotMatch(html, /<code\b/);
	});

	test(`${format}: keeps English and mixed formulas as code`, async () => {
		const html = await compile('To say `I` use `Verb stem + 겠다`.');
		assert.match(html, /<code>I<\/code>/);
		assert.match(html, /<code>Verb stem \+ 겠다<\/code>/);
		assert.doesNotMatch(html, /ko-term/);
	});

	test(`${format}: escapes special characters`, async () => {
		const html = await compile('Write `<나> & {저}` here.');
		assert.match(html, /<span lang="ko" class="ko-term">&lt;나&gt; &amp; (\{|&#123;|&#x7B;)저(\}|&#125;|&#x7D;)<\/span>/i);
	});

	test(`${format}: works inside headings and leaves fenced code alone`, async () => {
		const html = await compile('## The `군요` form\n\n```\n나는\n```');
		assert.match(html, /<h2[^>]*>The <span lang="ko" class="ko-term">군요<\/span> form<\/h2>/);
		assert.match(html, /<pre\b[^>]*><code[^>]*>나는/);
	});
}

test('compiles alongside the Pele and Sentence plugins', async () => {
	const html = await mdxToJs('Use `나`.\n\n<Sentence ko="나는 학생이야." en="I am a student." />', {
		...options, mdastPlugins: [pelePlugin, koreanPlugin, sentencePlugin],
	});
	assert.match(html.code, /import Sentence from "[^\n]+Sentence\.astro"/);
	assert.match(html.code, /ko-term/);
});
