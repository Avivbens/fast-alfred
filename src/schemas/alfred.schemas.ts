import { homedir } from 'node:os'
import { z } from 'zod'

function lines(): z.ZodType<string[], string> {
    return z.string().transform((value) =>
        value
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean),
    )
}

function paths(): z.ZodType<string[], string> {
    return lines().transform((values) => values.map((path) => path.replace(/^~(?=$|\/)/, homedir())))
}

function json<T extends z.ZodType>(schema: T): z.ZodType<z.output<T>, string> {
    return z
        .string()
        .transform((value, ctx) => {
            try {
                return JSON.parse(value) as unknown
            } catch {
                ctx.issues.push({ code: 'custom', message: 'Invalid JSON', input: value })
                return z.NEVER
            }
        })
        .pipe(schema)
}

/**
 * @description
 * zod schemas for the values Alfred passes from the `Configure Workflow...` fields
 *
 * Each one returns a zod schema, so you can chain `.default()` or `.optional()`
 *
 * @example
 * ```typescript
 *  const config = alfredClient.env.parse(
 *      z.object({
 *          show_hidden: alfredSchemas.checkbox().default(false),
 *          search_paths: alfredSchemas.paths().default([]),
 *      }),
 *  )
 * ```
 */
export const alfredSchemas = {
    /**
     * @description
     * A checkbox, which Alfred passes as `'1'` or `'0'`
     */
    checkbox: (): z.ZodType<boolean, string> => z.stringbool(),

    /**
     * @description
     * A number, from a slider or a text field
     */
    number: (): z.ZodType<number, unknown> => z.coerce.number(),

    /**
     * @description
     * A text area, as trimmed lines without the blank ones
     */
    lines,

    /**
     * @description
     * A text area of paths, as trimmed lines with a leading `~` expanded to the home directory
     */
    paths,

    /**
     * @description
     * A JSON string, parsed and then validated with the given schema
     *
     * @param schema - Schema to validate the parsed JSON with
     */
    json,
}
