# Rollup merge import

A rollup plugin that enables "merge-importing" all files within a folder that match a certain glob.

## Requirements

An environment where node is installed.

## Installation

```bash
yarn add --dev @frontline-hq/rollup-merge-import
```

or

```bash
npm install --save-dev @frontline-hq/rollup-merge-import
```

## Usage

Merge import your files by specifying the corresponding virtual import:

```ts
import * as module from "virtual:merge/contents/**/*.mdx";
```

The above will match all files withing the `contents` directory matching the glob `contents/**/*.mdx`.
It will then reexport all exports from these files under the name of each files path (excluding the root folders name, in this example `contents`).
Let's say we have the following file structure:

```
src
  contents
    en
      file1.mdx
    de
      file2.mdx
      file3.mdx
```

This will produce the following exports from the virtual import:

```ts
export * as en_file1 from "absolute_path_to_file1";
export * as de_file2 from "absolute_path_to_file2";
export * as de_file3 from "absolute_path_to_file3";
```

This plugin uses `_` as a path delimiter by default, but this is easily configured in the plugins settings.

## Syntax

```ts
import * as module from "virtual:merge/<folder>/<glob>";
```

Where

-   `<folder>` is the name of the folder that you want to search in
-   `<glob>` is the tiny-glob glob that specifies which files should be merge-imported

## Setup

Add this plugin to your rollup config:

```ts
// vite.config.ts
// ...

import rollupMergeImport from "@frontline-hq/rollup-merge-import";

export default defineConfig({
	plugins: [
		// ...
		rollupMergeImport(),
		// or rollupMergeImport({delimiter: "_"}) with custom delimiter
		// ...
	],
});
```

Don't forget to add a plugin capable of handling your files though!
A more complete config would probably could look more like this (here with mdx files):

```ts
// vite.config.ts
// ...

import rollupMergeImport from "@frontline-hq/rollup-merge-import";
import mdx from "@mdx-js/rollup";

export default defineConfig({
	plugins: [
		// ...
		rollupMergeImport(),
		mdx(),
	],
});
```

This plugin has on configurable option, which is the delimiter field already explained in the Usage section above:

```ts
type options = { delimiter?: string } | undefined;
```

## Shortcomings

Importing files from folders with `_` might lead to problems, as this plugin also uses `_` as a path delimiter on reexporting.

## Development

Please note the [fronline-hq development guidelines](https://github.com/frontline-hq/developer-guidelines)
