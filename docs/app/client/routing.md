---
prev: true
next: false
---

# Routing 🧭

A route lets an item of your Script Filter open a list of its own, like a sub-menu.
For example, a repository row opens the repository's checkouts, and the user filters them by typing.

You declare the routes once, each with a schema for the state it carries, so both opening a route and reading the open one are type-checked.

### How it works

1. `router.link()` turns an item into one that autocompletes to `› <label> ` instead of actioning.
2. Selecting it puts `› <label> ` into Alfred's input, and Alfred reruns your script.
3. `fast-alfred` keeps the links in an Alfred session variable, so on that run `router.match()` returns the open route, its state parsed by that route's schema, and whatever the user typed after the label as `filter`.

`alfredClient.output` adds the session variable for you.

## Example

```typescript
import { FastAlfred } from 'fast-alfred'
import { z } from 'zod'
import { listCheckouts, listRepos } from './services/git.service'

;(async () => {
    const alfredClient = new FastAlfred()
    const router = alfredClient.router({
        checkouts: { schema: z.object({ repo: z.string() }) },
    })

    const route = router.match()
    if (route?.name === 'checkouts') {
        const checkouts = await listCheckouts(route.state.repo)
        const items = checkouts.map((checkout) => ({
            title: checkout.branch,
            subtitle: checkout.path,
            arg: checkout.path,
        }))

        alfredClient.output({ items: alfredClient.matches(route.filter, items, (item) => item.title) })
        return
    }

    const repos = await listRepos()
    const items = repos.map((repo) =>
        router.link('checkouts', {
            label: repo.name,
            state: { repo: repo.path },
            title: repo.name,
            subtitle: `${repo.checkouts} checkouts`,
        }),
    )

    alfredClient.output({ items: alfredClient.inputMatches(items, (item) => item.title) })
})()
```

::: warning NOTE :warning:
Keep `Alfred filters results` unchecked in the Script Filter. Your script filters the open route by `route.filter` itself, and Alfred's own filtering would hide its items.
:::

## `alfredClient.router(routes)`

Declares the routes and returns the router. Call it once per script, since a second router would share the same session variable.

Each route takes:

| Option   | Description                                                    |
| -------- | -------------------------------------------------------------- |
| `schema` | Schema the route's state is parsed with, e.g. a zod schema     |
| `marker` | Prefix of the route's labels in Alfred's input, default is `›` |

### Routes in their own module

When your services build links or handle a route, declare the routes once with `defineRoutes`, and derive the types they need:

```typescript
import { type RouteMatch, type RouterService, defineRoutes } from 'fast-alfred'
import { z } from 'zod'

export const ROUTES = defineRoutes({
    checkouts: { schema: z.object({ repo: z.string() }) },
})

export type AppRouter = RouterService<typeof ROUTES> // for services that call `router.link`
export type CheckoutsRoute = RouteMatch<typeof ROUTES, 'checkouts'> // for the service that lists the checkouts
```

Then create the router with `alfredClient.router(ROUTES)`. `defineRoutes` rejects an unknown route option or a route without a schema, as `satisfies` would.

## `router.link(name, options)`

Takes the route to open, and an Alfred item plus:

| Option  | Description                                                                                           |
| ------- | ----------------------------------------------------------------------------------------------------- |
| `label` | Text shown in Alfred's input after the route's marker                                                 |
| `state` | Data the route needs, typed by its schema. It is kept as JSON in a session variable, so keep it small |

It returns the item with `valid: false` and `autocomplete` set, so `valid`, `autocomplete` and `arg` can't be passed.
Two links with the same label are numbered, `› api` and `› api (2)`, so each opens its own route.

## `router.match()`

Returns `{ name, state, filter }` for the open route, or `null` when the user is not in one.
The result is a union narrowed by `name`, so checking `route?.name === 'checkouts'` types `route.state` with that route's schema.

A route the script no longer declares, or a state its schema rejects, such as a session left over from an older workflow version, also returns `null`.

::: tip TIP :zap:
The trailing space after the label is optional, both `› api` and `› api ` open the route with an empty filter.
:::

::: info NOTE 📝
Workflows that never call `alfredClient.router` get exactly the same output as before. On a name clash, your own `variables` win over the router's one.
:::
