---
prev:
    text: 'ESM issues'
    link: '/app/troubleshooting/esm-issues'
next:
    text: 'No Target Version'
    link: '/app/troubleshooting/no-target-version'
---

# Empty Glob

`fast-alfred` bundle the files based on the configuration file from the root of your project.
By default, it assume that all the production files, the files that you're calling in the Workflow itself, are located in the `src/main` directory.

```log
▲ [WARNING] The glob pattern "src/main/\*.ts" did not match any files [empty-glob]
```

::: info NOTE 📝
Note that the default glob pattern refers to TypeScript files, but you can change it to any other file type.
:::

## Solution

::: tip TIP :zap:
You can find the default configuration options in the [API Reference](/app/setup/bundler-options#productionscripts).
:::

You can change the default production files to be in a different directories, by adding the following configuration to your `.fast-alfred.config.cjs` file.

::: code-group

```javascript [.fast-alfred.config.cjs]
/**
 * @type {import('fast-alfred').FastAlfredConfig}
 */
module.exports = {
    bundlerOptions: {
        // Should contain all glob pattern of the files you'd like to bundle into
        productionScripts: ['src/*.ts'],
    },
}
```

:::
