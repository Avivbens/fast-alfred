import { describe, expect, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import type { AlfredScriptFilter } from '@models/alfred-script-filter.model'
import type { RouteMatch } from '@models/router.model'
import { ROUTES_VARIABLE } from '../client.config'
import { RouterService, withRouterVariables } from './router.service'

const ROUTES = {
    checkouts: { schema: z.object({ repo: z.string() }) },
    branches: { schema: z.object({ remote: z.string() }), marker: '⎇' },
}

type AppRouter = RouterService<typeof ROUTES>

/**
 * Alfred passes the previous run's root variables back as environment variables, so a drill-in is a new router
 * built from the root run's `toVariables()`
 */
function drillInto(input: string, root: AppRouter): AppRouter {
    return new RouterService(ROUTES, input, root.toVariables()?.[ROUTES_VARIABLE])
}

function rootWith(...labels: string[]): AppRouter {
    const root = new RouterService(ROUTES, '', undefined)
    labels.forEach((label, index) => root.link('checkouts', { label, state: { repo: `repo-${index}` }, title: label }))

    return root
}

describe('RouterService', () => {
    describe('link', () => {
        it('should return an item that autocompletes into its route, without the route fields', () => {
            const router = new RouterService(ROUTES, '', undefined)

            const item = router.link('checkouts', {
                label: 'fast-alfred',
                state: { repo: '/dev/fast-alfred' },
                title: 'fast-alfred',
                subtitle: '3 checkouts',
            })

            expect(item).toEqual({
                title: 'fast-alfred',
                subtitle: '3 checkouts',
                valid: false,
                autocomplete: '› fast-alfred ',
            })
        })

        it("should prefix the label with the route's marker", () => {
            const router = new RouterService(ROUTES, '', undefined)

            const item = router.link('branches', { label: 'origin', state: { remote: 'origin' }, title: 'origin' })

            expect(item.autocomplete).toBe('⎇ origin ')
        })

        it('should number colliding labels, so each link opens its own route', () => {
            const router = rootWith('api', 'api')

            expect(Object.keys(JSON.parse(router.toVariables()?.[ROUTES_VARIABLE] ?? '{}'))).toEqual([
                '› api',
                '› api (2)',
            ])
        })

        it('should reject a route name or a state the routes do not define, at compile time', () => {
            const router = new RouterService(ROUTES, '', undefined)

            // @ts-expect-error - `checkouts` takes a `repo`, not a `remote`
            router.link('checkouts', { label: 'api', state: { remote: 'origin' }, title: 'api' })
            // @ts-expect-error - `tags` is not a route
            router.link('tags', { label: 'api', state: {}, title: 'api' })

            expect(router.toVariables()).toBeDefined()
        })
    })

    describe('match', () => {
        it('should return null outside a route', () => {
            expect(drillInto('fast', rootWith('fast-alfred')).match()).toBeNull()
        })

        it('should open with an empty filter right after drilling in', () => {
            const route = drillInto('› fast-alfred ', rootWith('fast-alfred')).match()

            expect(route).toEqual({ name: 'checkouts', state: { repo: 'repo-0' }, filter: '' })
        })

        it('should open when Alfred trimmed the trailing space', () => {
            expect(drillInto('› fast-alfred', rootWith('fast-alfred')).match()?.filter).toBe('')
        })

        it('should pass what the user typed after the label as the filter', () => {
            expect(drillInto('› fast-alfred feat ', rootWith('fast-alfred')).match()?.filter).toBe('feat')
        })

        it('should prefer the longest matching label', () => {
            const route = drillInto('› api (2) main', rootWith('api', 'api')).match()

            expect(route).toEqual({ name: 'checkouts', state: { repo: 'repo-1' }, filter: 'main' })
        })

        it('should not match a label that only shares a prefix', () => {
            expect(drillInto('› apis', rootWith('api')).match()).toBeNull()
        })

        it("should parse the state with the matched route's own schema", () => {
            const root = rootWith('api')
            root.link('branches', { label: 'origin', state: { remote: 'origin' }, title: 'origin' })

            expect(drillInto('⎇ origin ', root).match()).toEqual({
                name: 'branches',
                state: { remote: 'origin' },
                filter: '',
            })
        })

        it('should type the match as a union narrowed by the route name', () => {
            const route = drillInto('› api ', rootWith('api')).match()

            expectTypeOf(route).toEqualTypeOf<
                | { name: 'checkouts'; state: { repo: string }; filter: string }
                | { name: 'branches'; state: { remote: string }; filter: string }
                | null
            >()
            expectTypeOf<RouteMatch<typeof ROUTES, 'branches'>>().toEqualTypeOf<{
                name: 'branches'
                state: { remote: string }
                filter: string
            }>()
            expect(route?.name).toBe('checkouts')
        })

        it('should not open a route the script no longer defines', () => {
            const older = new RouterService(
                { ...ROUTES, tags: { schema: z.object({ tag: z.string() }) } },
                '',
                undefined,
            )
            older.link('tags', { label: 'v1', state: { tag: 'v1' }, title: 'v1' })

            expect(new RouterService(ROUTES, '› v1 ', older.toVariables()?.[ROUTES_VARIABLE]).match()).toBeNull()
        })

        it('should not open a route whose state its schema rejects, e.g. from an older workflow version', () => {
            const variable = JSON.stringify({ '› api': { name: 'checkouts', state: { repo: 1 } } })

            expect(new RouterService(ROUTES, '› api ', variable).match()).toBeNull()
        })

        it('should ignore a malformed session variable', () => {
            const router = new RouterService(ROUTES, '› api ', '{not json')

            expect(router.match()).toBeNull()
            expect(router.toVariables()).toBeUndefined()
        })
    })

    describe('toVariables', () => {
        it('should return nothing when no links exist', () => {
            expect(new RouterService(ROUTES, 'fast', undefined).toVariables()).toBeUndefined()
        })

        it("should emit this run's links", () => {
            const variables = rootWith('api').toVariables()

            expect(JSON.parse(variables?.[ROUTES_VARIABLE] ?? '')).toEqual({
                '› api': { name: 'checkouts', state: { repo: 'repo-0' } },
            })
        })

        it('should pass the incoming links back while a route is open, so the next keystroke keeps it', () => {
            const root = rootWith('api')

            expect(drillInto('› api ', root).toVariables()).toEqual(root.toVariables())
        })
    })
})

describe('withRouterVariables', () => {
    const output: AlfredScriptFilter = { items: [{ title: 'api' }], variables: { mode: 'open' } }

    it('should return the same output without router variables, so workflows without routes print the same JSON', () => {
        expect(withRouterVariables(output, undefined)).toBe(output)
    })

    it("should merge the router variables under the caller's own", () => {
        const result = withRouterVariables(output, { [ROUTES_VARIABLE]: '{}', mode: 'route' })

        expect(result.variables).toEqual({ [ROUTES_VARIABLE]: '{}', mode: 'open' })
    })
})
