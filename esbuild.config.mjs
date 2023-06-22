import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import { copy } from 'esbuild-plugin-copy';

const banner =
`/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = (process.argv[2] === "production");

const context = await esbuild.context({
	banner: {
		js: banner,
	},
	entryPoints: ["main.ts"],
	bundle: true,
	external: [
		"obsidian",
		"electron",
		"chromium-bidi/lib/cjs/bidiMapper/bidiMapper.js",
		"emitter",
		"@codemirror/autocomplete",
		"@codemirror/collab",
		"@codemirror/commands",
		"@codemirror/language",
		"@codemirror/lint",
		"@codemirror/search",
		"@codemirror/state",
		"@codemirror/view",
		"@lezer/common",
		"@lezer/highlight",
		"@lezer/lr",		
		...builtins],
	format: "cjs",
	target: "es2018",
	logLevel: "info",
	sourcemap: prod ? false : "inline",
	treeShaking: true,
	outfile: "vault/.obsidian/plugins/obsidian-marp-slides/main.js", //for local dev!!!
	//outfile: "main.js",
	plugins: [
		copy({
			assets: {
				from: ['node_modules/@marp-team/marp-cli/lib/*'],
				to: ['./lib/'],
			}
		})
	]
});

if (prod) {
	await context.rebuild();
	process.exit(0);
} else {
	await context.watch();
}