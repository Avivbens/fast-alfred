---
prev:
    text: 'Missing Configuration File'
    link: '/app/troubleshooting/missing-config-file'
next:
    text: 'Empty Glob'
    link: '/app/troubleshooting/empty-glob'
---

# ESM issues

`fast-alfred` by default bundles your scripts in the `cjs` format.
In case your script uses ESM syntax, you might encounter the following error:

```log
SyntaxError: Cannot use import statement outside a module
```

## Solution

### Make sure no ESM syntax is used in your build

`fast-alfred` provides nice [helpers to EMS syntax](../setup/bundler-options#esmhelpers), in order to have compatibility with CommonJS packages.
Make sure this option disabled in case you're using the `cjs` format.
Also, verify that the `outputFormat` is set to `cjs`.

::: code-group

```javascript [.fast-alfred.config.cjs]
/**
 * @type {import('fast-alfred').FastAlfredConfig}
 */
module.exports = {
    bundlerOptions: {
        // Both should be the default
        esmHelpers: false, // Disable compatibility for CommonJS packages
        outputFormat: 'cjs', // Output files in the CommonJS format
    },
}
```

:::

### Migrate to ESM

You can change the output format to `esm` by adding the following configuration to your `.fast-alfred.config.cjs` file.

::: warning NOTE :warning:
Your `package.json` should have `"type": "module"` in order to use the ESM format.
:::

::: code-group

```javascript [.fast-alfred.config.cjs]
/**
 * @type {import('fast-alfred').FastAlfredConfig}
 */
module.exports = {
    bundlerOptions: {
        outputFormat: 'esm', // Change the output format to ESM
        esmHelpers: true, // Enable compatibility for CommonJS packages - not mandatory, but recommended
    },
}
```

:::
