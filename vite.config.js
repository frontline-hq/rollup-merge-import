// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import typescript from "@rollup/plugin-typescript";
import viteVirtualMdx from "./src/index";

export default defineConfig({
	build: {
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: resolve(__dirname, "src/index.ts"),
			name: "viteVirtualMdx",
			// the proper extensions will be added
			fileName: "index",
		},
	},
	plugins: [typescript(), viteVirtualMdx()],
});
