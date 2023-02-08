import glob from "tiny-glob";
import path from "path";
import type { Plugin } from "rollup";
import mdx from "@mdx-js/rollup";
import recmaSection from "@frontline-hq/recma-sections";

function getComment(comment: string) {
	return comment
		? comment.trim().startsWith("c:")
			? comment.trim().slice(2)
			: undefined
		: undefined;
}

function viteVirtualMdx({ ext = "mdx" }: { ext?: string } = {}): Plugin {
	const virtualModuleId = `virtual:${ext}`;
	const resolvedVirtualModuleId = "\0" + virtualModuleId;

	return {
		name: "vite-virtual-mdx", // required, will show up in warnings and errors
		resolveId(id) {
			if (id === virtualModuleId) {
				return resolvedVirtualModuleId;
			}
			return null;
		},
		async load(id) {
			if (id === resolvedVirtualModuleId) {
				let code = "";
				for (const file of await glob(`**/contents/**/*.${ext}`, {
					absolute: true,
				})) {
					const parsedPath = path.parse(file);
					const e = parsedPath.dir.split(path.sep);
					e.splice(0, e.indexOf("contents") + 1);
					e.push(parsedPath.name);
					const exportStatement = `export * as ${e.join(
						"_"
					)} from "${file}";`;
					code += exportStatement;
				}
				return code;
			}
			return null;
		},
	};
}

export default function setupViteVirtualMdx({
	ext = "mdx",
}: { ext?: string } = {}) {
	return [
		mdx({
			jsxImportSource: "preact",
			recmaPlugins: [[recmaSection, { getComment: getComment }]],
		}),
		viteVirtualMdx({ ext }),
	];
}
