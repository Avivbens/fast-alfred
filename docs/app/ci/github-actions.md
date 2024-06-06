---
prev: false
next: true
---

# GitHub Actions :octopus:

### Description

`fast-alfred` CI / CD template recommends you work with [GitHub Actions](https://docs.github.com/en/actions).

At the end of this process, you'd be able to publish your Workflow into GitHub Releases.

::: warning Note :warning:
The following example uses `semantic-release` mechanism and all related packages.
Please follow the [Semantic Release](./semantic-release) guide to set up your project.

:::

## Setup

::: tip Note :zap:
Copy these files into your `.github/workflows` folder, at the root of your project.
You can modify them to fit your needs. The current structure is a suggestion to reduce the maintenance of your CI / CD.
:::

::: code-group

```yaml [.github/workflows/release-master.yaml]
---
name: '📦 Create New Release'

on:
    push:
        branches:
            - master

permissions:
    contents: write
    pull-requests: write
    issues: write
    deployments: write

concurrency:
    group: release-master-${{ github.workflow }}-${{ github.ref }}
    cancel-in-progress: true

jobs:
    checks:
        name: ✅ Check for Release
        runs-on: ubuntu-latest
        timeout-minutes: 15

        env:
            HUSKY: 0

        steps:
            - name: Checkout
              uses: actions/checkout@v4
              with:
                  fetch-depth: 1

            - name: 🧪 Check out repository code
              uses: ./.github/workflows/health-check
              with:
                  run-tests: 'false'

    release:
        name: 📦 Release Version
        runs-on: ubuntu-latest
        timeout-minutes: 60
        needs:
            - checks

        env:
            HUSKY: 0

        steps:
            - name: Checkout
              uses: actions/checkout@v4
              with:
                  fetch-depth: 0
                  persist-credentials: false

            - name: Git Config
              run: |
                  git config --global user.name "github-bot"
                  git config --global user.email "github-bot@gmail.com"

            - name: 🖥️ Setup Env
              uses: ./.github/workflows/install

            - name: Release
              env:
                  GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
                  GIT_AUTHOR_NAME: github-bot
                  GIT_AUTHOR_EMAIL: github-bot@gmail.com
                  GIT_COMMITTER_NAME: github-bot
                  GIT_COMMITTER_EMAIL: github-bot@gmail.com
              run: |
                  npx semantic-release
```

```yaml [.github/workflows/health-check/action.yaml]
---
name: '☑️ Checks Pipeline'
description: 'Checks the codebase health'

inputs:
    run-tests-command:
        description: 'Run tests command, default is `npm test`'
        default: 'npm test'
        required: false

    run-tests:
        description: 'Run tests'
        default: 'true'
        required: false

    run-lint-command:
        description: 'Run linter command, default is `npm run lint`'
        default: 'npm run lint'
        required: false

    run-lint:
        description: 'Run lint'
        default: 'true'
        required: false

    run-build-command:
        description: 'Run build command, default is `npm run build`'
        default: 'npm run build'
        required: false

    run-build:
        description: 'Run build'
        default: 'true'
        required: false

runs:
    using: composite
    steps:
        - name: 🖥️ Setup Env
          uses: ./.github/workflows/install

        - name: 🧪 Test
          if: ${{ inputs.run-tests == 'true' }}
          shell: bash
          run: |
              ${{ inputs.run-tests-command }}

        - name: 🔨 Build
          if: ${{ inputs.run-build == 'true' }}
          shell: bash
          run: |
              ${{ inputs.run-build-command }}

        - name: ✅ Lint
          if: ${{ inputs.run-lint == 'true' }}
          shell: bash
          run: |
              ${{ inputs.run-lint-command }}
```

```yaml [.github/workflows/install/action.yaml]
---
name: '☑️ Install deps'
description: 'Install dependencies and setup node'

runs:
    using: composite
    steps:
        - name: 🖥️ Setup Node
          uses: actions/setup-node@v4
          with:
              node-version: 20

        - name: 🔗 Install Dependencies
          shell: bash
          run: |
              npm ci --no-fund --no-audit --no-progress --ignore-scripts
```

:::
