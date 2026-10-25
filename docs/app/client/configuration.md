---
prev: true
next: false
---

# Workflow Configuration ⚙️

Alfred passes every field of the `Configure Workflow...` panel to your script as an environment variable, and always as a string.
A checkbox arrives as `'1'` or `'0'`, a slider as `'15'`, and a field the user never touched may not arrive at all.

Parsing them with a schema gives you one typed object, with defaults and validation in one place.

## Setup

`fast-alfred` accepts any schema with a `parse` method. [zod](https://zod.dev) is the recommended one, and an optional peer dependency, so install it in your workflow:

```bash
npm install zod
```

## Parse the whole configuration

`env.parse` hands all environment variables to your schema, and returns its result:

```typescript
import { FastAlfred } from 'fast-alfred'
import { z } from 'zod'

const ConfigSchema = z.object({
    slice_amount: z.coerce.number().default(10),
    show_hidden: z.stringbool().default(false),
    sort_by: z.enum(['name', 'date']).default('name'),
})

;(() => {
    const alfredClient = new FastAlfred()

    // { slice_amount: number, show_hidden: boolean, sort_by: 'name' | 'date' }
    const config = alfredClient.env.parse(ConfigSchema)
})()
```

The object keys are the variable names you set in Alfred's configuration builder. Any other environment variable is dropped.

## Parse a single variable

```typescript
const sliceAmount = alfredClient.env.getEnv('slice_amount', { schema: z.coerce.number().default(10) })
```

The return type comes from the schema, so no explicit generic is needed.

::: info NOTE 📝
A missing variable reaches the schema as `undefined`, so `.default()` or `.optional()` decide what happens.
Without either, a missing or invalid variable throws a `ZodError`. Pass it to `alfredClient.error` to show it in Alfred.
:::

## Recipes per Alfred field

| Alfred field | Value Alfred passes       | Schema                               |
| ------------ | ------------------------- | ------------------------------------ |
| Checkbox     | `'1'` or `'0'`            | `z.stringbool()`                     |
| Slider       | the number, e.g. `'15'`   | `z.coerce.number()`                  |
| Text field   | the text                  | `z.string()`, or `z.coerce.number()` |
| Popup menu   | the selected value        | `z.enum(['name', 'date'])`           |
| File picker  | the selected path         | `z.string()`                         |
| Text area    | the lines, joined by `\n` | [a list of lines](#a-list-of-lines)  |
| Any text     | a JSON string             | [JSON](#json)                        |

### A list of lines

Split a text area into trimmed lines, and drop the blank ones:

```typescript
const lines = z.string().transform((value) =>
    value
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
)

const ConfigSchema = z.object({
    search_paths: lines.default([]),
})
```

### JSON

Parse a JSON string, report invalid JSON as a validation issue, then validate the result with another schema:

```typescript
function json<T extends z.ZodType>(schema: T) {
    return z
        .string()
        .transform((value, ctx) => {
            try {
                return JSON.parse(value)
            } catch {
                ctx.issues.push({ code: 'custom', message: 'Invalid JSON', input: value })
                return z.NEVER
            }
        })
        .pipe(schema)
}

const ConfigSchema = z.object({
    aliases: json(z.record(z.string(), z.string())).default({}),
})
```
