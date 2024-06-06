---
prev: true
next: true
---

# Runtime Explain :rocket:

`fast-alfred` provides an out-of-the-box shell script to call the bundled files in the workflow.

The main advantage of this approach is that your Node.js script would be executed in an environment that is aware of the Alfred workflow, and it will be able to interact with it, as well as having caching and other features.

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
