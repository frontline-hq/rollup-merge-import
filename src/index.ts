import glob from "tiny-glob";
import path from "path";
import type { Plugin } from "rollup";

export default function rollupMergeImport({
	delimiter = "_",
}: { delimiter?: string } = {}): Plugin {
	const virtualModuleId = `virtual:merge`;
	const resolvedVirtualModuleId = "\0" + virtualModuleId;

	return {
		name: "rollup-merge-import", // required, will show up in warnings and errors
		resolveId(id) {
			if (id.startsWith(virtualModuleId)) {
				return "\0" + id;
			}
			return null;
		},
		async load(id) {
			if (id.startsWith(resolvedVirtualModuleId)) {
				const pattern = id.replace("\0virtual:merge/", "");
				const dir = path
					.dirname(pattern)
					.split("/")
					.filter((v) => v)[0];
				let code = "";
				for (const file of await glob(`**/${pattern}`, {
					absolute: true,
				})) {
					const parsedPath = path.parse(file);
					const e = parsedPath.dir.split(path.sep);
					e.splice(0, e.indexOf(dir) + 1);
					e.push(parsedPath.name);
					const exportStatement = `export * as ${e.join(
						delimiter
					)} from "${file}";`;
					code += exportStatement;
				}
				return code;
			}
			return null;
		},
	};
}
