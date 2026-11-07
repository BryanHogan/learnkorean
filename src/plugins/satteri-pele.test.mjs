import assert from 'node:assert/strict';
import test from 'node:test';
import { renderJSX } from 'astro/runtime/server/index.js';
import { markdownToHtml, mdxToJs } from 'satteri';
import pelePlugin from './satteri-pele.mjs';
import sentencePlugin from './satteri-sentence.mjs';

const fileURL = new URL('../content/docs/chapter/3/example.mdx', import.meta.url);
const fence = (source, language = 'mermaid') => `\`\`\`${language}\n${source}\n\`\`\``;
const diagram = fence(`flowchart TD
    accTitle: Choosing 나 or 이나
    accDescr: Add 이나 after a consonant and 나 after a vowel.
    A["옷 → 옷이나"] --> B["영화 → 영화나"]`);

const options = { fileURL, mdastPlugins: [pelePlugin], jsxImportSource: 'astro' };

async function mdxToHtml(source) {
	const { code } = await mdxToJs(source, options);
	// Resolve the runtime before importing the compiled module from memory.
	const executable = code.replace('"astro/jsx-runtime"', JSON.stringify(import.meta.resolve('astro/jsx-runtime')));
	const { default: Content } = await import(`data:text/javascript;base64,${Buffer.from(executable).toString('base64')}`);
	return String(await renderJSX({}, Content()));
}

for (const [format, compile] of [
	['Markdown', async (source) => (await markdownToHtml(source, options)).html],
	['MDX', mdxToHtml],
]) {
	test(`${format}: renders accessible SVG with Korean text and a focusable scroll region`, async () => {
		const html = await compile(diagram);
		assert.match(html, /<svg\b/);
		assert.doesNotMatch(html, /<pre\b|&lt;svg|<script\b/);
		assert.match(html, /class="pele-diagram"[^>]*tabindex="0"[^>]*role="region"[^>]*aria-label="Diagram/);
		assert.match(html, /<title id="pele-diagram-0-title">Choosing 나 or 이나<\/title>/);
		assert.match(html, /aria-labelledby="pele-diagram-0-title"/);
		assert.match(html, /aria-describedby="pele-diagram-0-desc"/);
		assert.match(html, /<desc id="pele-diagram-0-desc">Add 이나 after a consonant and 나 after a vowel\.<\/desc>/);
		assert.match(html, /옷 → 옷이나/);
		assert.match(html, /영화 → 영화나/);
		assert.match(html, /viewBox="[^"]+" width="\d+" height="\d+"/);
	});

	test(`${format}: preserves literal braces and escapes special characters`, async () => {
		const html = await compile(fence('flowchart TD\nA["{이나} & 나"] --> B["#lt;example#gt;"]'));
		assert.match(html, /\{이나\} &amp; 나/);
		assert.match(html, /&lt;example&gt;/);
		assert.doesNotMatch(html, /<example>/);
	});

	test(`${format}: gives repeated diagrams distinct IDs with valid accessibility references`, async () => {
		const html = await compile(`${diagram}\n\n${diagram}`);
		const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
		assert.equal(new Set(ids).size, ids.length);
		for (const id of ['pele-diagram-0-title', 'pele-diagram-1-title', 'pele-diagram-0-desc', 'pele-diagram-1-desc']) {
			assert.ok(ids.includes(id));
			assert.ok(html.includes(`${id.endsWith('-title') ? 'aria-labelledby' : 'aria-describedby'}="${id}"`));
		}
	});

	test(`${format}: keeps state isolated across sequential and concurrent compilations`, async () => {
		const expected = await compile(diagram);
		await compile(`${diagram}\n\n${diagram}`);
		const results = await Promise.all([compile(diagram), compile(diagram)]);
		for (const html of results) assert.equal(html, expected);
	});

	test(`${format}: rejects invalid diagrams with file and fence line`, async () => {
		await assert.rejects(() => compile(`# Example\n\n${fence('not-a-diagram')}`), (error) => {
			assert.ok(error.message.includes(fileURL.href));
			assert.match(error.message, /at line 3:/);
			assert.ok(error.cause instanceof Error);
			assert.ok(error.message.includes(error.cause.message));
			return true;
		});
	});
}

test('leaves ordinary code fences and prose unchanged in Markdown and MDX', async () => {
	const source = `# Example\n\n${fence('const example = "{이나}";', 'js')}\n\n${fence('flowchart TD\nA --> B', '')}\n\nInline \`mermaid\`.`;
	for (const compile of [markdownToHtml, mdxToJs]) {
		const expected = await compile(source, { ...options, mdastPlugins: [] });
		assert.deepEqual(await compile(source, options), expected);
	}
});

test('compiles diagrams alongside the Sentence auto-import plugin', async () => {
	const { code } = await mdxToJs(`${diagram}\n\n<Sentence ko="옷이나 모자" en="Clothes or a hat" />`, {
		...options, mdastPlugins: [pelePlugin, sentencePlugin],
	});
	assert.match(code, /import Sentence from "[^\n]+Sentence\.astro"/);
	assert.match(code, /_jsxs?\("svg"/);
	assert.match(code, /_jsx\(Sentence/);
});
