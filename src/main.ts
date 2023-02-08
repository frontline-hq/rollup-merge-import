import "./style.css";
import * as msg from "virtual:merge/contents/**/*.mdx";
import { render, h, type ComponentType } from "preact";
import lodash from "lodash";
const { get } = lodash;

const appDiv = document.getElementById("app");
console.log(msg);
if (appDiv) {
	const component: unknown = get(msg, "de_index.default");
	render(h(component as ComponentType, {}), appDiv);
}
