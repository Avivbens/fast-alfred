import { describe, expect, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { RouterService } from '../core/services/router.service'
import { defineRoutes } from './routes.utils'

describe('defineRoutes', () => {
    it('should return the routes as they are, typed for the router', () => {
        const definition = { checkouts: { schema: z.object({ repo: z.string() }), marker: '⎇' } }

        const routes = defineRoutes(definition)

        expect(routes).toBe(definition)
        expectTypeOf(new RouterService(routes, '', undefined).match()).toEqualTypeOf<{
            name: 'checkouts'
            state: { repo: string }
            filter: string
        } | null>()
    })

    it('should reject an unknown route option or a route without a schema, at compile time', () => {
        const schema = z.object({ repo: z.string() })

        // @ts-expect-error - `markr` is a typo of `marker`
        defineRoutes({ checkouts: { schema, markr: '⎇' } })
        // @ts-expect-error - every route needs a schema
        defineRoutes({ checkouts: { marker: '⎇' } })

        expect(defineRoutes({ checkouts: { schema } }).checkouts.schema).toBe(schema)
    })
})
