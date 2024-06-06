---
prev: false
next:
    text: 'Empty Glob'
    link: '/app/troubleshooting/empty-glob'
---

# Missing Configuration File

`fast-alfred` reads the configuration file from the root of your project.
If you are missing the configuration file, you will see the following warn:

```log
No config file found for 'fast-alfred' 🚀
Taking default values!
```

## Solution

::: tip TIP :zap:
You can find the default configuration options in both [Bundler Options](/app/setup/bundler-options) and [Workflow Metadata](/app/setup/workflow-metadata).
:::

Simply add a `.fast-alfred.config.cjs` file at the root of your project.

```bash
touch .fast-alfred.config.cjs
echo "/**\n * @type {import('fast-alfred').FastAlfredConfig}\n */\nmodule.exports = {}" > .fast-alfred.config.cjs
```

### Should look like

::: code-group

```javascript [.fast-alfred.config.cjs]
/**
 * @type {import('fast-alfred').FastAlfredConfig}
 */
module.exports = {}
```

:::
