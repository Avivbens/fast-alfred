---
prev: true
next: false
---

# Semantic Release :rocket:

### Description

`fast-alfred` CI / CD template recommends you work with [`semantic-release`](https://github.com/semantic-release/semantic-release).

At the end of this process, you'd be able to publish your Workflow into GitHub Releases, with a versioning system based on your commits.

## Installation

```bash
npm install semantic-release @semantic-release/{changelog,commit-analyzer,exec,git,github,release-notes-generator}
```

::: tip TIP :zap:
It is very recommended to use tools for commit message enforcement like [`commitlint`](https://github.com/conventional-changelog/commitlint?tab=readme-ov-file#readme)
:::

## Setup

::: warning NOTE :warning:
Fill in the upper case placeholders with your own values, such as `REPO_NAME`, `WORKFLOW_NAME`, etc.
:::

Create a `.releaserc` file in the root of your project and add the following configuration:

::: code-group

```json [.releaserc]
{
    "$schema": "https://json.schemastore.org/semantic-release.json",
    "repositoryUrl": "https://github.com/REPO_NAME.git",
    "branches": [
        "+([0-9])?(.{+([0-9]),x}).x",
        "master",
        "next",
        "next-major",
        {
            "name": "beta",
            "prerelease": true
        },
        {
            "name": "alpha",
            "prerelease": true
        }
    ],
    "tagFormat": "v${version}",
    "plugins": [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        [
            "@semantic-release/changelog",
            {
                "changelogFile": "CHANGELOG.md"
            }
        ],
        [
            "@semantic-release/exec",
            {
                "prepareCmd": "npx fast-alfred -t ${nextRelease.version}"
            }
        ],
        [
            "@semantic-release/git",
            {
                "assets": ["package.json", "package-lock.json", "info.plist", "CHANGELOG.md"],
                "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
            }
        ],
        [
            "@semantic-release/github",
            {
                "assets": [
                    {
                        "path": "./esbuild/WORKFLOW_NAME.alfredworkflow",
                        "label": "WORKFLOW_NAME.alfredworkflow",
                        "name": "WORKFLOW_NAME.alfredworkflow"
                    }
                ]
            }
        ]
    ]
}
```

:::
