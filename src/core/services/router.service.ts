import type { AlfredListItem } from '@models/alfred-list-item.model'
import type { AlfredScriptFilter } from '@models/alfred-script-filter.model'
import type { RouteLink, RouteMatch, RouteState, Routes } from '@models/router.model'
import { ROUTES_VARIABLE, ROUTE_MARKER } from '../client.config'

interface RouteEntry {
    name: string
    state: unknown
}

function isRouteEntry(value: unknown): value is RouteEntry {
    return typeof value === 'object' && value !== null && typeof (value as RouteEntry).name === 'string'
}

/**
 * The session variable is written by a previous run, so a malformed one means no open route rather than a crash
 */
function parseEntries(variable: string | undefined): Record<string, RouteEntry> {
    if (!variable) {
        return {}
    }

    try {
        const parsed: unknown = JSON.parse(variable)
        if (typeof parsed !== 'object' || parsed === null) {
            return {}
        }

        return Object.fromEntries(
            Object.entries(parsed).filter((entry): entry is [string, RouteEntry] => isRouteEntry(entry[1])),
        )
    } catch {
        return {}
    }
}

/**
 * Alfred passes the root `variables` of a Script Filter back into its next run, which is what keeps a route open.
 * The caller's own variables win on a clash.
 */
export function withRouterVariables(
    output: AlfredScriptFilter,
    variables: Record<string, string> | undefined,
): AlfredScriptFilter {
    if (!variables) {
        return output
    }

    return { ...output, variables: { ...variables, ...output.variables } }
}

/**
 * @description
 * Route Alfred's input into typed routes, e.g. a row that opens a list of its own
 */
export class RouterService<R extends Routes> {
    private readonly routes: R
    private readonly input: string
    private readonly incoming: Record<string, RouteEntry>
    private readonly registered: Record<string, RouteEntry> = {}

    constructor(routes: R, input: string | undefined, variable: string | undefined) {
        this.routes = routes
        this.input = input ?? ''
        this.incoming = parseEntries(variable)
    }

    /**
     * @description
     * Build an item that opens a route when the user selects it
     *
     * @param name - The route to open
     * @param options - The Alfred item, plus the label and the state the route needs
     */
    public link<K extends keyof R & string>(name: K, options: RouteLink<RouteState<R[K]>>): AlfredListItem {
        /**
         * Widened to a concrete type, since a rest of a generic type loses `AlfredListItem`'s known fields
         */
        const { label, state, ...item }: RouteLink<unknown> = options

        const query = this.uniqueQuery(`${this.routes[name]?.marker ?? ROUTE_MARKER} ${label}`)
        this.registered[query] = { name, state }

        /**
         * The trailing space lets the user type a filter right away
         */
        return { ...item, valid: false, autocomplete: `${query} ` }
    }

    /**
     * @description
     * Get the open route, or `null` when the user is not in one
     *
     * @note
     * A route this script no longer defines, or a state its schema rejects (e.g. a session from an older workflow
     * version), is not an open route either
     */
    public match(): RouteMatch<R> | null {
        const entries = { ...this.incoming, ...this.registered }

        /**
         * The longest label wins, so `› api (2)` is not read as `› api` with a `(2)` filter
         */
        const [query] = Object.keys(entries)
            .filter((key) => this.input === key || this.input.startsWith(`${key} `))
            .sort((a, b) => b.length - a.length)

        const entry = query === undefined ? undefined : entries[query]
        const route = entry && Object.hasOwn(this.routes, entry.name) ? this.routes[entry.name] : undefined
        if (query === undefined || !entry || !route) {
            return null
        }

        try {
            const state = route.schema.parse(entry.state)

            /**
             * The name is one of `routes` and the state passed that route's schema, which TypeScript cannot correlate
             */
            return { name: entry.name, state, filter: this.input.slice(query.length).trim() } as RouteMatch<R>
        } catch {
            return null
        }
    }

    /**
     * @description
     * Variables that keep the routes working on the next run, added to the output by `alfredClient.output`
     *
     * @returns - This run's links, otherwise the incoming ones while a route is open, or `undefined` when no links exist
     */
    public toVariables(): Record<string, string> | undefined {
        const entries = Object.keys(this.registered).length ? this.registered : this.incoming
        if (!Object.keys(entries).length) {
            return undefined
        }

        return { [ROUTES_VARIABLE]: JSON.stringify(entries) }
    }

    private uniqueQuery(base: string): string {
        let query = base
        for (let count = 2; query in this.registered; count++) {
            query = `${base} (${count})`
        }

        return query
    }
}
