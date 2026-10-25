import { afterEach, describe, expect, it, vi } from 'vitest'
import { ZodError, z } from 'zod'
import { EnvService } from './env.service'

describe('EnvService', () => {
    const envService = new EnvService()

    afterEach(() => {
        vi.unstubAllEnvs()
    })

    describe('getEnv', () => {
        it('should return the raw value without options', () => {
            vi.stubEnv('sort_by', 'name')

            const sortBy = envService.getEnv('sort_by')

            expect(sortBy).toBe('name')
        })

        it('should parse a present value with a schema', () => {
            vi.stubEnv('slice_amount', '15')

            const sliceAmount = envService.getEnv('slice_amount', { schema: z.coerce.number() })

            expect(sliceAmount).toBe(15)
        })

        it('should pass a missing value to the schema, so its default applies', () => {
            vi.stubEnv('slice_amount', undefined)

            const sliceAmount = envService.getEnv('slice_amount', { schema: z.coerce.number().default(10) })

            expect(sliceAmount).toBe(10)
        })

        it('should throw a ZodError for an invalid value', () => {
            vi.stubEnv('show_hidden', 'maybe')

            expect(() => envService.getEnv('show_hidden', { schema: z.stringbool() })).toThrow(ZodError)
        })
    })

    describe('parse', () => {
        it('should parse the whole environment with an object schema', () => {
            vi.stubEnv('slice_amount', '15')
            vi.stubEnv('show_hidden', '0')
            vi.stubEnv('sort_by', undefined)

            const config = envService.parse(
                z.object({
                    slice_amount: z.coerce.number(),
                    show_hidden: z.stringbool(),
                    sort_by: z.enum(['name', 'date']).default('name'),
                }),
            )

            expect(config).toEqual({ slice_amount: 15, show_hidden: false, sort_by: 'name' })
        })
    })
})
