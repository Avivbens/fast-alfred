---
prev: true
next: true
---

# Runtime Explain :rocket:

`fast-alfred` provides an out-of-the-box shell script to call the bundled files in the workflow.

The main advantage of this approach is that your Node.js script would be executed in an environment that is aware of the Alfred workflow, and it will be able to interact with it, as well as having caching and other features.

::: warning NOTE :rotating_light:
In order to use `fast-alfred` runtime in ESM format, you need to configure these two options [`esmHelpers`](./bundler-options#esmhelpers) and [`outputFormat`](./bundler-options#outputformat).
:::

## How It Works

At build time, an additional asset, named `run-node.sh` would be attached to the workflow, under the `assets` directory.
This script is responsible for executing the bundled Node.js script.

### Example

::: tip TIP :zap:
The code below is an example of how to trigger your Node.js script in an Alfred Script Filter.
:::

```bash
./esbuild/assets/run-node.sh esbuild/your-script-under-main.js "$1"
```

#### DEMO

![Runtime Example](/runtime-example.jpeg)

## Local Debugging

Sometimes, we just want to run scripts locally, and put some debugger breakpoints to understand the flow.

### `CommonJS` Format

In case you're using the [`CommonJS` format](./bundler-options#outputformat), you can run the following command:

```bash
ts-node ./src/main/your-script-under-main.ts
```

::: tip TIP :zap:
In case you're using [`typescript` paths](https://www.typescriptlang.org/tsconfig/#paths), you might need to convert them, without the help of `fast-alfred` bundler.
Add the following to your `tsconfig.json` file:,

```json
    "ts-node": {
        "require": ["tsconfig-paths/register"]
    },
```

And install the `tsconfig-paths` package:

```bash
npm i -D tsconfig-paths
```

:::

### `ESM` Format

For the `ESM` format, `ts-node` is known to have some issues with it.

In case you're using [`typescript` paths](https://www.typescriptlang.org/tsconfig/#paths), you'll have to convert them is a separate step.

::: warning NOTE :rotating_light:
You need to install the `tsc-alias` package to convert the paths

```bash
npm i -D tsc-alias
```

:::

Your `package.json` should have the following script:

```json
{
    "scripts": {
        "build": "tsc -p tsconfig.json && tsc-alias -p tsconfig.json"
    }
}
```

Then, you can run the following command:

```bash
node ./dist/your-script-under-main.js
```

::: tip TIP :zap:
The code above is an example of how to trigger your Node.js script in a local environment,
right from your IDE.

**You can place your breakpoints and debug your script from your .ts file (require `sourceMap`)**
:::
