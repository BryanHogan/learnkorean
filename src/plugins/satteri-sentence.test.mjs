import assert from 'node:assert/strict';
import test from 'node:test';
import { Parser } from 'acorn';
import { markdownToHtml, mdxToJs } from 'satteri';
import sentencePlugin from './satteri-sentence.mjs';

const fileURL = new URL('../content/docs/chapter/3/example.mdx', import.meta.url);
const componentURL = new URL('../components/Sentence.astro', import.meta.url);
const example = '<Sentence ko="김치가 맛있어요." en="Kimchi is delicious." />';

function compile(source, options = {}) {
	return mdxToJs(source, { fileURL, jsxImportSource: 'astro', mdastPlugins: [sentencePlugin], ...options });
}

function sentenceImports(result) {
	return Parser.parse(result.code, { ecmaVersion: 'latest', sourceType: 'module' }).body
		.filter((node) => node.type === 'ImportDeclaration' && node.specifiers.some((s) => s.local.name === 'Sentence'));
}

for (const [name, source] of [
	['standalone', example],
	['repeated', `${example}\n\n${example}`],
	['inline', `Example: ${example}.`],
	['nested', `<div>\n${example}\n</div>`],
	['fragment', `<>\n${example}\n</>`],
]) {
	test(`imports Sentence once for ${name} elements`, async () => {
		const imports = sentenceImports(await compile(source));
		assert.equal(imports.length, 1);
		assert.equal(new URL(imports[0].source.value, fileURL).href, componentURL.href);
	});
}

for (const declaration of [
	'import Sentence from "custom";',
	'import { Sentence } from "custom";',
	'import { Example as Sentence } from "custom";',
	'import * as Sentence from "custom";',
	'export const Sentence = () => <div />;',
	'export function Sentence() { return null; }',
	'export class Sentence {}',
	'export const { Example: Sentence } = {};',
	'export const [Sentence = null] = [];',
	'export const { ...Sentence } = {};',
]) {
	test(`preserves binding: ${declaration}`, async () => {
		const source = `${example}\n\n${declaration}`;
		const expected = await compile(source, { mdastPlugins: [] });
		assert.equal((await compile(source)).code, expected.code);
	});
}

test('does not mistake imported names, property names, or function parameters for module bindings', async () => {
	const source = `import { Sentence as Other } from "custom";
export const { Sentence: renamed } = {};
export const demo = (Sentence) => <div />;

${example}`;
	assert.equal(sentenceImports(await compile(source)).length, 1);
});

for (const source of [
	'# Ordinary MDX\n\nNo component here.',
	'```mdx\n<Sentence />\n```\n\n`<Sentence />`',
	'export const label = "<Sentence />";\n\n{ /* <Sentence /> */ }',
	'<Examples.Sentence />',
	'{true && <Sentence />}',
]) {
	test(`leaves non-target content unchanged: ${source.split('\n')[0]}`, async () => {
		const expected = await compile(source, { mdastPlugins: [] });
		assert.equal((await compile(source)).code, expected.code);
	});
}

test('preserves ordinary Markdown output', async () => {
	const source = '# Heading\n\n<Sentence />\n\n| A | B |\n| - | - |\n| 1 | 2 |';
	const expected = await markdownToHtml(source);
	const actual = await markdownToHtml(source, { mdastPlugins: [sentencePlugin] });
	assert.deepEqual(actual, expected);
});

test('resolves imports from different depths using portable relative paths', async () => {
	for (const location of ['../content/docs/example.mdx', '../content/docs/chapter/3/example.mdx', '../example.mdx']) {
		const documentURL = new URL(location, import.meta.url);
		const [generated] = sentenceImports(await compile(example, { fileURL: documentURL }));
		assert.ok(generated.source.value.startsWith('.'));
		assert.ok(!generated.source.value.includes('\\'));
		assert.equal(new URL(generated.source.value, documentURL).href, componentURL.href);
	}
});

test('keeps state isolated across sequential and concurrent compilations', async () => {
	const explicit = `import Sentence from "custom";\n\n${example}`;
	await compile(explicit);
	assert.equal(sentenceImports(await compile(example)).length, 1);
	const results = await Promise.all([compile(example), compile(explicit), compile(example)]);
	assert.equal(sentenceImports(results[0])[0].source.value.endsWith('/Sentence.astro'), true);
	assert.equal(sentenceImports(results[1])[0].source.value, 'custom');
	assert.equal(sentenceImports(results[2])[0].source.value.endsWith('/Sentence.astro'), true);
});
