import { env } from 'node:process'
import type { GetEnvOptions } from '@models/get-env-options.model'
import type { Schema } from '@models/schema.model'

/**
 * @description
 * Get Environment variables
 *
 * All Workflow user configuration would be injected in here
 */

export class EnvService {
    getEnv<T = unknown>(key: string): T | undefined
    getEnv<T>(key: string, options: { schema: Schema<T> }): T
    /**
     * @deprecated - please use the `{ schema }` option instead
     *
     * @note
     *
     * Deprecation date: 25 Oct 2026
     */
    getEnv<T = unknown>(key: string, options: GetEnvOptions<T>): T
    getEnv<T = unknown>(key: string, options?: GetEnvOptions<T> | { schema: Schema<T> }): T | undefined {
        if (options && 'schema' in options) {
            return options.schema.parse(env[key])
        }

        const { defaultValue, parser } = options ?? {}

        const value = env[key]
        if (value === undefined) {
            return defaultValue as T | undefined
        }

        return parser ? parser(value) : (value as T)
    }

    /**
     * @description
     * Parse all environment variables with one schema, e.g. a `z.object` of the Workflow configuration
     *
     * @param schema - Schema to parse the environment variables with
     */
    parse<T>(schema: Schema<T>): T {
        return schema.parse(env)
    }
}
