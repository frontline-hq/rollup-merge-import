import glob from "tiny-glob";
import path from "node:path";
import type { Plugin } from "rollup";

export default function rollupMergeImport({
	delimiter = "_",
	debug = false,
}: { delimiter?: string; debug?: boolean } = {}): Plugin {
	const virtualModuleId = `virtual:merge`;
	const resolvedVirtualModuleId = "\0" + virtualModuleId;

	return {
		name: "rollup-merge-import", // required, will show up in warnings and errors
		resolveId(id) {
			if (id.startsWith(virtualModuleId)) {
				if (debug)
					console.log(
						`1 - resolving ${id} with virtual module id ${virtualModuleId}`
					);
				return "\0" + id;
			}
			return null;
		},
		async load(id) {
			if (id.startsWith(resolvedVirtualModuleId)) {
				if (debug)
					console.log(
						`2 - loading ${id} with resolved virtual module id ${resolvedVirtualModuleId}`
					);
				const pattern = id.replace("\0virtual:merge/", "");
				if (debug)
					console.log(
						`3 - detected pattern file glob pattern ${pattern}`
					);
				const dir = path
					.dirname(pattern)
					.split("/")
					.filter((v) => v)[0];
				if (debug)
					console.log(
						`4 - base directory name from which the filenames should start: ${dir}`
					);
				let code = "";
				for (const file of await glob(`**/${pattern}`, {
					absolute: true,
				})) {
					if (debug)
						console.log(
							`\n5.1 - detected file ${file} matching pattern`
						);
					const parsedPath = path.parse(file);
					const e = parsedPath.dir.split(path.sep);
					e.splice(0, e.indexOf(dir) + 1);
					e.push(parsedPath.name);
					const exportStatement = `export * as ${e.join(
						delimiter
					)} from "${file}";`;
					if (debug) {
						console.log(
							`5.2 - name of export for this file: ${e.join(
								delimiter
							)}`
						);
						console.log(
							`5.3 - resulting export statement: ${exportStatement}`
						);
					}
					code += exportStatement;
				}
				return code;
			}
			return null;
		},
	};
}
