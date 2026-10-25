import type { AlfredListItem } from './alfred-list-item.model'
import type { Schema } from './schema.model'

export interface RouteDefinition<S = unknown> {
    /**
     * @description
     * Schema the route's state is parsed with on every run
     */
    schema: Schema<S>

    /**
     * @description
     * Prefix of the route's labels in Alfred's input, default is `›`
     */
    marker?: string
}

export type Routes = Record<string, RouteDefinition>

export type RouteState<R extends RouteDefinition> = R['schema'] extends Schema<infer S> ? S : never

export interface RouteLink<S> extends AlfredListItem {
    /**
     * `Omit` would collapse to `AlfredListItem`'s index signature and drop every known field, so these are blocked with `never`
     * instead - the item opens its route rather than actioning
     */
    valid?: never
    autocomplete?: never
    arg?: never

    /**
     * @description
     * Text shown in Alfred's input once the route is open, right after the route's `marker`
     */
    label: string

    /**
     * @description
     * Data the route needs, e.g. the selected repository path
     *
     * @note
     * It is kept as JSON in an Alfred session variable, so keep it small and serializable
     */
    state: S
}

/**
 * @description
 * The open route, as a union narrowed by `name` - pass `N` to pick a single route's match
 */
export type RouteMatch<R extends Routes, N extends keyof R & string = keyof R & string> = {
    [K in N]: {
        /**
         * @description
         * Name of the open route
         */
        name: K

        /**
         * @description
         * State of the link that opened the route, parsed with the route's schema
         */
        state: RouteState<R[K]>

        /**
         * @description
         * What the user typed after the route's label, to filter its items with
         */
        filter: string
    }
}[N]
