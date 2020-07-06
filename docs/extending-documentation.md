# Extending documentation

```js script
export default {
  title: 'Guidelines/Extending documentation',
};
```

## Intro

If you extend lion components you don't only want to reuse the component, but want to reuse the documentation as well. Here we explain how you can do this.

## Override documentation

As a first step you want to change the names for e.g. lion-tabs to lea-tabs (see [announcement](http://localhost:9001/?path=/docs/intro-announcement--page)).
And secondly we need to analyze all the import paths of lion, and adopt them to your own project structure.

To do this we make use of [Providence](http://localhost:9001/?path=/docs/tools-providence-main--run-providence). This tool makes a full map of all the import paths and can replace them with the correct paths of your project.

So lets install it:

```sh
yarn add providence-analytics --dev
```

And to use it we need to add to your projects `package.json` the following script:

```json
"scripts": {
  "providence:extend": "providence extend-docs -r 'node_modules/@lion/*' --prefix-from lion --prefix-to lea"
}
```

The `--prefix-from` and `--prefix-to` are the prefixes of the project you extend from (most of the times `lion`) and your own projects prefix (in this case `lea`).

Running the script will create a `providence-extend-docs-data.json` file, with all from/to information.

> We automatically run this script every time we update our lion components, since we don't want to have broken documentation.

We use [Babel plugin extend docs](http://localhost:9001/?path=/docs/tools-babelpluginextenddocs--page) in our storybook build, to change all the prefixes and paths, based on the `providence-extend-docs-data.json` file.

Create a `babel.config.js` file with the following logic:

```js
const path = require('path');
const providenceExtendConfig = require('./providence-extend-docs-data.json');

const extendDocsConfig = {
  rootPath: path.resolve('.'),
  changes: providenceExtendConfig,
};

module.exports = {
  overrides: [
    {
      test: ['./node_modules/@lion/*/README.md', './node_modules/@lion/*/docs/*.md'],
      plugins: [['babel-plugin-extend-docs', extendDocsConfig]],
    },
  ],
};
```

Check if it all works ....

## Adjust documentation

In some cases you don't want to show all examples of how to use a component or add extra use cases.

For this step we make use of:

- [Remark extend](http://localhost:9001/?path=/docs/tools-remark-extend--page)

- Babel plugin use it with generated config
- Remark extend plugin for content overrides:
  1. replacers
  2. content selectors with selecting sections etc.
