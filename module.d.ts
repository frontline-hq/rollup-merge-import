import Module from "module";

declare module "virtual:mdx" {
	// eslint-disable-next-line
	const component: Record<string, Module>;
	export = component;
}
