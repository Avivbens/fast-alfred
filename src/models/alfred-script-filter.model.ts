import type { AlfredListItem } from './alfred-list-item.model'

/**
 * @description
 * The Script Filter outputs a JSON object which Alfred uses to populate the results.
 *
 * @see [Official Docs](https://www.alfredapp.com/help/workflows/inputs/script-filter/json/)
 */
export interface AlfredScriptFilter {
    items: AlfredListItem[]

    /**
     * @description
     * Scripts can be set to re-run automatically after an interval using the rerun key with a value from 0.1 to 5.0 seconds.
     * The script will only be re-run if the script filter is still active and the user hasn't changed the state of the filter by typing and triggering a re-run.
     */
    rerun?: number

    /**
     * @description
     * Scripts which take a while to return can cache results so users see data sooner on subsequent runs.
     * The Script Filter presents the results from the previous run when caching is active and hasn't expired.
     * Because the script won't execute when loading cached data, we recommend this option only be used with `"Alfred filters results"`.
     */
    cache?: {
        /**
         * @description
         * The number of seconds to cache the result for.
         */
        seconds?: number

        /**
         * @description
         * Asks the Script Filter to try to show any cached data first.
         * If it's determined to be stale, the script runs in the background and replaces results with the new data when it becomes available.
         */
        loosereload?: boolean
    }

    /**
     * @description
     * If set to true, Alfred will not learn from the results.
     */
    skipknowledge?: boolean

    /**
     * @description
     * Variables within a `variables` object will be passed out of the script filter and remain accessible throughout the current session as environment variables.
     *
     * In addition, they are passed back in when the script reruns within the same session.
     * This can be used for managing state between runs as the user types input or when the script is set to re-run after an interval.
     */
    variables?: Record<any, any>

    [key: string]: any
}
