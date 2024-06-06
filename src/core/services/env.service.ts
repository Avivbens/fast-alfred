/* eslint-disable no-dupe-class-members */
import { env } from 'node:process'
import type { GetEnvOptions } from '@models/get-env-options.model'

export class EnvService {
    getEnv<T = unknown>(key: string): T | undefined
    getEnv<T = unknown>(key: string, options: GetEnvOptions<T>): T
    getEnv<T = unknown>(key: string, options?: GetEnvOptions<T>): T | undefined {
        const { defaultValue, parser } = options ?? {}

        const value = env[key]
        if (value === undefined) {
            return defaultValue as T | undefined
        }

        return parser ? parser(value) : (value as T)
    }
}
