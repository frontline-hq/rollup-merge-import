// vite.config.js
import { defineConfig } from "vite";
import typescript from "@rollup/plugin-typescript";
import rollupMergeImport from "./src/index";
import mdx from "@mdx-js/rollup";
import recmaSection from "@frontline-hq/recma-sections";
import { resolve } from "node:path";

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
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: ["tiny-glob", "node:path"],
			output: {
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					"tiny-glob": "tiny-glob",
					"node:path": "node:path",
				},
			},
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
