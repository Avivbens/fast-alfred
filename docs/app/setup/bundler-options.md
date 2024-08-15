---
prev: false
next: true
---

# Bundler Options 🏗️

`fast-alfred` bundles the files based on the configuration file from the root of your project.

You can configure any bundler option via the configuration file on your workspace root,
named `.fast-alfred.config.cjs`.

<hr>

# Available Options

::: tip TIP :zap:
`fast-alfred` has a default configuration that should work for most of the workflows.
:::

See the available options below:

## `productionScripts`

By default, `fast-alfred` assumes that all the production files, the files that you're calling in the Workflow itself, are located in the `src/main` directory.

You can change that by the `productionScripts` property, which holds an array of glob patterns.

##### Example

```javascript
/**
 * @type {import('fast-alfred').FastAlfredConfig}
 */
module.exports = {
    bundlerOptions: {
        productionScripts: ['src/*.ts'], // Should contain all TypeScript files under the `src` directory
    },
}
```

## `assets`

By default, `fast-alfred` would bundle the `fast-alfred` runtime, `run-node.sh`.
You can add more assets to be bundled by adding paths into the `assets` property

##### Example

```javascript
/**
 * @type {import('fast-alfred').FastAlfredConfig}
 */
module.exports = {
    bundlerOptions: {
        assets: ['src/some-path/*'], // All files under the `src/some-path` directory will be bundled as assets
    },
}
```

## `rootAssets`

By default, `fast-alfred` would bundle a few files from the root of the project, like the `package.json` and the `README.md`.
You can add more assets to be bundled at the root, instead of the `assets` directory, by adding paths to the `rootAssets` property.

##### Example

```javascript
/**
 * @type {import('fast-alfred').FastAlfredConfig}
 */
module.exports = {
    bundlerOptions: {
        rootAssets: ['List Filter Images'], // All files under the `List Filter Images` directory, as well as the directory itself, would be bundled as assets
    },
}
```

## `assetsDir`

By default, `fast-alfred` would place all assets under the `assets` directory in the output directory.
You can change that by setting the `assetsDir` property.

##### Example

```javascript
/**
 * @type {import('fast-alfred').FastAlfredConfig}
 */
module.exports = {
    bundlerOptions: {
        assetsDir: 'resources', // All assets will be placed under the `resources` directory in the output directory
    },
}
```

## `targetDir`

By default, `fast-alfred` would place all the output files under the `esbuild` directory.
You can change that by setting the `targetDir` property.

::: warning CI / CD Usage :rotating_light:

If you're using the [`fast-alfred` CI / CD template](/app/ci/github-actions), updating the `targetDir` property should be handled automatically.
The only thing you should update is the [`.releaserc` asset path](/app/ci/semantic-release).
Make sure `npx fast-alfred pack` script works correctly.
:::

##### Example

```javascript
/**
 * @type {import('fast-alfred').FastAlfredConfig}
 */
module.exports = {
    bundlerOptions: {
        targetDir: 'dist', // All output files will be placed under the `dist` directory
    },
}
```

## `esmHelpers`

By default, `fast-alfred` aims to be written in the `cjs` Module format.
If your package is using the `esm` format, AKA, having `"type": "module"` in the `package.json`, you should enable the `esmHelpers` property.

::: warning Warning :warning:
In case your package is written in `cjs`, enabling this option would break your build.

**Note that you should also set the [`outputFormat` property](#outputformat) to `esm` to output the files in the ES Module format.**
:::

##### Example

```javascript
/**
 * @type {import('fast-alfred').FastAlfredConfig}
 */
module.exports = {
    bundlerOptions: {
        esmHelpers: true, // Enable compatibility for CommonJS packages
    },
}
```

## `outputFormat`

By default, `fast-alfred` would output the files in the `cjs` format.
You can change that by setting the `outputFormat` property.

::: tip TIP :zap:
If your `package.json` has `"type": "module"`, you should output the files in the `esm` format.
Otherwise, you should keep it in the `cjs` format.
:::

##### Example

```javascript
/**
 * @type {import('fast-alfred').FastAlfredConfig}
 */
module.exports = {
    bundlerOptions: {
        outputFormat: 'esm', // Output files in the ES Module format
    },
}
```

## `minify`

By default, `fast-alfred` would not minify the output files.
It might be useful to enable this option if you want to reduce the bundle size.

::: tip TIP :zap:
By official Alfred documentation, you should not minify the output files, so users would be able to read the code.
See more details [in here](https://alfred.app/security-and-privacy/#signed-binaries).
:::

##### Example

```javascript
/**
 * @type {import('fast-alfred').FastAlfredConfig}
 */
module.exports = {
    bundlerOptions: {
        minify: true, // Enable minification
    },
}
```

## `treeShaking`

By default, `fast-alfred` would tree-shake the output files. That way, only the necessary code will be included in the final bundle.
You can disable this feature by setting the `treeShaking` property to `false`.

::: warning Warning :warning:
Disabling tree shaking might increase the bundle size.
You should only disable tree shaking if you're facing issues with the output bundle.
:::

##### Example

```javascript
/**
 * @type {import('fast-alfred').FastAlfredConfig}
 */
module.exports = {
    bundlerOptions: {
        treeShaking: false, // Disable tree shaking
    },
}
```

## `overrideEsbuildOptions`

`fast-alfred` uses `esbuild` under the hood to bundle the files.
You can override the `esbuild` options by setting the `overrideEsbuildOptions` property.

::: warning Warning :warning:
You should be careful while overriding the `esbuild` options.
All the options provided here would be overridden, if specified in this property.

You can find the available options in the [esbuild documentation](https://esbuild.github.io/api/).
:::

##### Example

```javascript
/**
 * @type {import('fast-alfred').FastAlfredConfig}
 */
module.exports = {
    bundlerOptions: {
        overrideEsbuildOptions: {
            target: 'esnext', // Override the target option
        },
    },
}
```
