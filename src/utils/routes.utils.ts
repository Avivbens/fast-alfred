import type { RouteDefinition, Routes } from '@models/router.model'

/**
 * A route option beyond `RouteDefinition`'s must be `never`, so a typo fails here as it would with `satisfies Routes`
 */
type ExactRoutes<R extends Routes> = {
    [K in keyof R]: R[K] & Record<Exclude<keyof R[K], keyof RouteDefinition>, never>
}

/**
 * @description
 * Declare routes in a module of their own, typed for `alfredClient.router`
 *
 * @param routes - The routes, each with the schema of its state and an optional marker
 *
 * @example
 * ```typescript
 *  export const ROUTES = defineRoutes({
 *      checkouts: { schema: z.object({ repo: z.string() }) },
 *  })
 *
 *  export type AppRouter = RouterService<typeof ROUTES>
 *  export type CheckoutsRoute = RouteMatch<typeof ROUTES, 'checkouts'>
 * ```
 */
export function defineRoutes<R extends Routes>(routes: R & ExactRoutes<R>): R {
    return routes
}
