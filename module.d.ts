import Module from "module";

declare module "virtual:merge/*" {
	// eslint-disable-next-line
	const component: Record<string, Module>;
	export = component;
}
