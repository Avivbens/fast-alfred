---
prev: true
next: false
---

# Automated Workflow Updates 🔄

::: warning Experimental :warning:
This feature is new and subject to change. Please use with caution and report any issues.
:::

`fast-alfred` can automatically inject update-handling logic into your workflow at build time. This provides a seamless way for your users to keep the workflow up-to-date without any manual intervention.

The process is reversible and preserves all your existing workflow connections, including those with modifier keys.

#### DEMO

![Runtime Example](/updater-example.gif)

## Build-Time Configuration

To enable the feature, change the configuration file `.fast-alfred.config.cjs` at the root of your project to include `updates`.
This instructs the bundler to inject the necessary helper objects into the workflow.

```javascript
/**
 * @type {import('fast-alfred').FastAlfredConfig}ı
 */
module.exports = {
    updates: {
        bundleHelpers: true, // Enable the injection of update helpers
        exclude: ['esbuild/excluded-script'], // Optional, exclude specific scripts from this feature
        userConfiguration: {
            checkUpdatesCheckbox: true, // Optional, add a user-facing checkbox to enable/disable updates
        },
    },
}
```

- `bundleHelpers`: Set to `true` to enable the injection.
- `exclude`: An array of script paths to exclude from this feature.
- `userConfiguration`: An object to configure user-facing settings.
    - `checkUpdatesCheckbox`: Set to `true` to add a checkbox in the workflow's configuration sheet that allows users to enable or disable automatic update checks.

## Runtime Configuration

After enabling the helpers, configure their behavior in your client-side script using the `alfredClient.updates()` method.

```typescript
import { FastAlfred, gitHubMonoRepoFetcher } from 'fast-alfred'

const alfredClient = new FastAlfred()

alfredClient.updates({
    fetcher: gitHubMonoRepoFetcher({
        owner: 'your-github-username',
        repo: 'your-repo-name',

        /**
         * The #1 group catches the release version from the GitHub Releases
         * should match your package.json version.
         */
        releasePattern: /release\/my-workflow-name\/(.*)/, // Regex to match the release version
        autoInstall: true, // Automatically install the update when available
    }),
    checkInterval: 60 * 5, // Optional, Check for updates every 5 hours - default is 1 day
    snoozeTime: 60 * 24, // Optional, Snooze updates for 1 day - default is 3 day
})
```

::: info Important
You should call the `alfredClient.updates()` method in every production script filter where you want the update check to be triggered. Fast Alfred's internal caching (`checkInterval`) ensures that it won't check for updates on every single execution, but only when the interval has passed.
:::

Fast Alfred provides two predefined fetchers, `gitHubPolyRepoFetcher` and `gitHubMonoRepoFetcher`, which can be imported directly from the package.

::: tip Custom Fetchers :sparkles:
You are not limited to the predefined fetchers. You can provide your own custom fetcher function, as long as it conforms to the required `Fetcher` interface. This allows you to fetch updates from any source, such as a private server or a different Git provider.
:::

## Local Development

::: tip Debugger Behavior
Note that the snooze functionality (`snoozeTime`) is automatically bypassed when Alfred's debugger is open. This allows you to test the update logic without being blocked by the snooze period.
:::

For a cleaner local development experience, you can remove all injected helpers by running:

```bash
npx fast-alfred --drop-update-helpers
```
