import { AstroIntegration } from 'astro';
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

import { toString } from 'hast-util-to-string';
import { h } from 'hastscript';
import { escape } from 'html-escaper';

import { tokens, foregroundPrimary, backgroundPrimary } from './syntax-highlighting-theme';
import { astroAsides } from './integrations/astro-asides';
import { astroSpoilers } from './integrations/astro-spoilers';
import { astroCodeSnippets } from './integrations/astro-code-snippets';
import { remarkFallbackLang } from './plugins/remark-fallback-lang';
import { rehypeTasklistEnhancer } from './plugins/rehype-tasklist-enhancer';

import languages from './src/i18n/languages';
import { normalizeLangTag } from './src/i18n/bcp-normalize';

const AnchorLinkIcon = h(
	'svg',
	{
		width: 16,
		height: 16,
		version: 1.1,
		viewBox: '0 0 16 16',
		xlmns: 'http://www.w3.org/2000/svg',
	},
	h('path', {
		fillRule: 'evenodd',
		fill: 'currentcolor',
		d: 'M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z',
	})
);

const createSROnlyLabel = (text: string) => {
	const node = h('span.sr-only', `Section titled ${escape(text)}`);
	node.properties['is:raw'] = true;
	return node;
};

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.astro.build/',
	legacy: {
		astroFlavoredMarkdown: true,
	},
	integrations: [
		preact({ compat: true }),
		sitemap({
			i18n: {
				defaultLocale: 'en',
				locales: Object.fromEntries(
					Object.keys(languages).map((lang) => [lang, normalizeLangTag(lang)])
				),
			},
		}),
		astroAsides(),
		astroSpoilers(),
		astroCodeSnippets(),
		viteSsrFix(),
	],
	markdown: {
		syntaxHighlight: 'shiki',
		shikiConfig: {
			theme: {
				name: 'Star gazer',
				type: 'dark',
				settings: tokens,
				fg: foregroundPrimary,
				bg: backgroundPrimary,
			},
		},
		remarkPlugins: [
			// These are here because setting custom plugins disables the default plugins
			'remark-gfm',
			['remark-smartypants', { dashes: false }],
			// Add our custom plugin that marks links to fallback language pages
			remarkFallbackLang(),
		],
		rehypePlugins: [
			'rehype-slug',
			// This adds links to headings
			[
				'rehype-autolink-headings',
				{
					properties: {
						class: 'anchor-link',
					},
					behavior: 'after',
					group: ({ tagName }) =>
						h(`div.heading-wrapper.level-${tagName}`, {
							tabIndex: -1,
						}),
					content: (heading) => [
						h(
							`span.anchor-icon`,
							{
								ariaHidden: 'true',
							},
							AnchorLinkIcon
						),
						createSROnlyLabel(toString(heading)),
					],
				},
			],
			// Tweak GFM task list syntax
			rehypeTasklistEnhancer(),
		],
	},
});

function viteSsrFix(): AstroIntegration {
	// Externalize deps of `astro-og-canvas` in dev as Vite can't transform the CJS code in SSR.
	// Build works fine as Vite uses Rollup and bundles differently.
	// TODO: Remove this once fixed in Astro itself.
	return {
		name: 'externalize-deps',
		hooks: {
			'astro:config:setup': ({ command, updateConfig }) => {
				if (command === 'dev') {
					updateConfig({
						vite: {
							ssr: {
								external: ['canvaskit-wasm', 'entities'],
							},
						},
					});
				}
			},
		},
	};
}
