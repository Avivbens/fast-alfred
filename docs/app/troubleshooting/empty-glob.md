---
prev:
    text: 'Missing Configuration File'
    link: '/app/troubleshooting/missing-config-file.md'
# next:
#     text: 'Not Found'
#     link: '/app/troubleshooting/not-found'
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

<!-- TODO - include link to official API docs -->

::: tip TIP ⚡️
You can find the default configuration options in the [API Reference](/api/fast-alfred/fast-alfred-config).
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
