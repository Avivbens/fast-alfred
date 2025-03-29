---
prev: true
next: false
---

# Versioning & Bundling :package:

`fast-alfred` provides a way to manage your workflow version automatically.

In order to sync the version across `package.json` and `info.plist`, just pass in to
`fast-alfred` the version you want to use:

```bash
npx fast-alfred -t 1.2.3 # Set the version to 1.2.3, creating a .alfredworkflow file
```

## Versioning By Commits Using `semantic-release` :arrows_counterclockwise:

`fast-alfred` CI / CD template recommend you to work with [`semantic-release`](https://github.com/semantic-release/semantic-release) in order to track and manage your workflow version :rocket:
You can find more details in the [Semantic Release](../ci/semantic-release.md) section.

### See the [CI / CD section](/app/ci/github-actions) for versioning integrations :sparkles:

## Options

-   `-t` or `--target-version`: Set the version to use
-   `--no-pack`: Skip the packing process
-   `--no-package-json`: Skip updating the package.json & package-lock.json files

-   `-h` or `--help`: Display help message
-   `--verbose`: Display verbose output
