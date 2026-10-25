---
prev: false
next: false
---

# `fast-alfred` Client

`fast-alfred` provides a lean and optimized client to interact with the Alfred workflow system.

### Intro

Your script should look like that:

```typescript
import { FastAlfred } from 'fast-alfred'

;(() => {
    const alfredClient = new FastAlfred()

    // ... Rest of your script
})()
```

# Available Options

::: tip TIP :zap:
`fast-alfred` client should contain all JSDocs types and descriptions, so you can use your IDE to explore the available options.
:::

See the available options below:

## `output`

Outputs the script filter object to interact with Alfred.
Allows you to show a list of items in Alfred, with all Alfred interaction options.

## `log`

Logs errors for debugging purposes.

## `matches`

```typescript
matches<K = AlfredListItem>(
    input: string,
    list: K[],
    compareBy: (item: K, searchTerm: string) => string,
    options?: { caseSensitive: boolean },
): K[]
```

Searches a list of items for `input`, and returns the items that contain it.
The search is case insensitive by default, pass `{ caseSensitive: true }` to change that.
Both sides are Unicode normalized, and a list of plain strings is compared directly, without calling `compareBy`.

#### Example

```typescript
const items: AlfredListItem[] = repos.map((repo) => ({ title: repo.name, arg: repo.path }))

alfredClient.output({
    items: alfredClient.matches(alfredClient.input, items, (item) => item.title),
})
```

::: tip TIP :zap:
`matches` is also exported as a standalone function, so your services can filter without holding the client:

```typescript
import { matches } from 'fast-alfred'

export function filterRepos(query: string, repos: Repo[]): Repo[] {
    return matches(query, repos, (repo) => repo.name)
}
```

:::

## `inputMatches`

```typescript
inputMatches<K = any>(
    list: K[],
    compareBy: (item: K, searchTerm: string) => string,
    options?: { caseSensitive: boolean },
): K[]
```

Searches a list of items for the workflow input. The search can be case sensitive or not, default is false.

::: info NOTE 📝
This function has the same behavior as `matches`, with `input` set to the workflow input.
:::

#### Example

```typescript
alfredClient.output({ items: alfredClient.inputMatches(items, (item) => item.title) })
```

## `error`

Shows an error message in Alfred UI.

## `alfredInfo`

Service to get Alfred's environment variables. You can find all Alfred & Workflow metadata in here.

## `userConfig`

::: warning Deprecated :warning:
This property is deprecated and will be removed in a future version.
Please use the `env` property instead.
:::

Get and set dedicated configuration for the Workflow.
You can use it to store and retrieve data saved about the user.

## `icons`

Get icons from the system.
You can use it to get the icon path for a specific icon.

#### Example

```typescript
alfredClient.output({
    items: [
        {
            title: 'Some Error',
            icon: {
                path: alfredClient.icons.getIcon('error'), // Get the error icon
            },
        },
    ],
})
```

## `config`

Get and set dedicated configuration for the Workflow.
You can use it to store and retrieve data saved about the user.

## `env`

Get Environment variables.
All Workflow user configuration would be injected in here.

::: info NOTE 📝
When inserting data into the `Configure Workflow...` on Alfred UI, it will be available in the `env` service.
:::

#### Example

```typescript
const someVariable: number = alfredClient.env.getEnv(Variables.SOME_VARIABLE, { defaultValue: 10, parser: Number })
```

## `cache`

Get and set dedicated cache for your Workflow. You can leverage it to optimize your Workflow performance.
Use the `setWithTTL` in order to set a cache with a time to live.

::: info NOTE 📝
The TTL is in milliseconds, so you can set it to 1000 for 1 second, 60000 for 1 minute, and so on
:::

#### Example

```typescript
const data: SomeType[] = alfredClient.cache.get<SomeType[]>(SOME_DATA_KEY) ?? (await fetchData())

alfredClient.cache.setWithTTL(SOME_DATA_KEY, data, { maxAge: CACHE_TTL })
```

## `input: string`

Get the input passed into the script filter (by `$1` or `{query}`).

::: tip TIP :zap:
In case you have multiple inputs, you can use the `inputs` property to get all of them.
:::

## `inputs: string[]`

Get multiple inputs passed into the script filter (by `$1`, `$2`, `$3`, etc).
::: tip TIP :zap:
In case you have only one input, you can use the `input` property to get it.
:::

## `updates`

Configures the automated workflow updates feature. This method should be called in every script filter where you want to enable update checking.

For more details, see the [Automated Workflow Updates](/app/setup/updates.md) documentation.

## `isDebuggerOpen`

A boolean that indicates whether the Alfred debugger is currently open.
This is useful for changing the behavior of your workflow during debugging (e.g., disabling caching or showing more verbose logging).

# Service Types

The services behind the client's properties are exported as classes.
Use them to type your own services, and create real instances of them in tests.

| Property     | Class                |
| ------------ | -------------------- |
| `alfredInfo` | `AlfredInfoService`  |
| `cache`      | `CacheConfigService` |
| `env`        | `EnvService`         |
| `icons`      | `IconService`        |

#### Example

```typescript
import type { AlfredListItem, IconService } from 'fast-alfred'

export function toErrorItem(error: Error, icons: IconService): AlfredListItem {
    return { title: error.message, valid: false, icon: { path: icons.getIcon('error') } }
}
```

Pass the client's own instance at runtime, and a real one in tests:

```typescript
import { IconService } from 'fast-alfred'

toErrorItem(error, alfredClient.icons) // in your script
toErrorItem(new Error('Boom'), new IconService()) // in your spec
```

::: info NOTE 📝
`CacheConfigService` stores its data on disk, so give it a temporary `cwd` in tests.
:::
