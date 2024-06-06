---
prev:
    text: 'Empty Glob'
    link: '/app/troubleshooting/empty-glob'

next: false
---

# No Target Version 🎯

`fast-alfred` requires a target version to be provided in the build time.

```log
Error: No target version provided
```

## Solution

You can specify the target version when building the workflow:

```bash
npx fast-alfred 1.2.3
```
