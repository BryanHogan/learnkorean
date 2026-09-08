import { dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Parser } from 'acorn';
import jsx from 'acorn-jsx';

const parser = Parser.extend(jsx());
const componentPath = fileURLToPath(new URL('../components/Sentence.astro', import.meta.url));

/** Check binding patterns, including destructuring, without matching property names. */
function bindsSentence(pattern) {
	if (!pattern) return false;
	switch (pattern.type) {
		case 'Identifier': return pattern.name === 'Sentence';
		case 'RestElement': return bindsSentence(pattern.argument);
		case 'AssignmentPattern': return bindsSentence(pattern.left);
		case 'ArrayPattern': return pattern.elements.some(bindsSentence);
		case 'ObjectPattern':
			return pattern.properties.some((property) =>
				bindsSentence(property.type === 'RestElement' ? property.argument : property.value));
		default: return false;
	}
}

function declaresSentence(statement) {
	switch (statement.type) {
		case 'ImportDeclaration':
			return statement.specifiers.some((specifier) => bindsSentence(specifier.local));
		case 'ExportNamedDeclaration':
		case 'ExportDefaultDeclaration':
			return statement.declaration ? declaresSentence(statement.declaration) : false;
		case 'VariableDeclaration':
			return statement.declarations.some((declaration) => bindsSentence(declaration.id));
		case 'FunctionDeclaration':
		case 'ClassDeclaration':
			return bindsSentence(statement.id);
		default: return false;
	}
}

/** Sätteri calls this factory for each document, including concurrent compilations. */
export default function sentencePlugin() {
	let checked = false;

	function visit(node, context) {
		if (checked || context.sourceFormat !== 'mdx' || node.name !== 'Sentence') return;
		checked = true;

		let root = node;
		while (context.parent(root)) root = context.parent(root);

		// Inspect the whole module so imports after the element also take precedence.
		const source = root.children
			.filter((child) => child.type === 'mdxjsEsm')
			.map((child) => child.value)
			.join('\n');
		const module = parser.parse(source, { ecmaVersion: 'latest', sourceType: 'module' });
		if (module.body.some(declaresSentence)) return;

		if (!context.fileURL) throw new Error('Sentence auto-import requires an MDX file URL.');
		let importPath = relative(dirname(fileURLToPath(context.fileURL)), componentPath).replaceAll('\\', '/');
		if (!importPath.startsWith('.')) importPath = `./${importPath}`;
		context.prependChild(root, {
			type: 'mdxjsEsm',
			value: `import Sentence from ${JSON.stringify(importPath)};`,
		});
	}

	return {
		name: 'sentence-auto-import',
		mdxJsxFlowElement: visit,
		mdxJsxTextElement: visit,
	};
}
