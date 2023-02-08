// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import typescript from "@rollup/plugin-typescript";
import rollupMergeImport from "./src/index";
import mdx from "@mdx-js/rollup";
import recmaSection from "@frontline-hq/recma-sections";

function getComment(comment: string) {
	return comment
		? comment.trim().startsWith("c:")
			? comment.trim().slice(2)
			: undefined
		: undefined;
}

export default defineConfig({
	build: {
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: resolve(__dirname, "src/index.ts"),
			name: "rollupMergeImport",
			// the proper extensions will be added
			fileName: "index",
		},
	},
	plugins: [
		typescript(),
		mdx({
			jsxImportSource: "preact",
			recmaPlugins: [[recmaSection, { getComment: getComment }]],
		}),
		rollupMergeImport(),
	],
});
