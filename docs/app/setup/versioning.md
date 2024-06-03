---
prev: true
next: false
---

# Versioning :package:

`fast-alfred` provides a way to manage your workflow version automatically.

In order to sync the version across `package.json` and `info.plist`, just pass in to `fast-alfred` the version you want to use:

```bash
npx fast-alfred 1.2.3 # This will set the version to 1.2.3
```

## Versioning in `package.json` :arrows_counterclockwise:

`fast-alfred` CI / CD template recommend you to work with [`semantic-release`](https://github.com/semantic-release/semantic-release) in order to track and manage your workflow version :rocket:
