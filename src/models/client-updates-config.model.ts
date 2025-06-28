export interface UpdatesFetcherResponse {
    /**
     * @description
     * The currently available latest version of the workflow.
     */
    latestVersion: string

    /**
     * @description
     * Direct download URL for the latest version of the workflow.
     *
     * If not provided, the workflow updater would not be interactive.
     * In case no direct download available, the browser will be opened to the download page.
     */
    downloadUrl?: string

    /**
     * @description
     * If true, the download URL will be used for direct download.
     *
     * That means the workflow will be downloaded directly without opening a browser,
     * and automatically installed.
     *
     * @default
     * false
     */
    isDirectDownload?: boolean

    /**
     * @description
     * If true, the workflow will be automatically installed after download.
     *
     * This is only relevant if `isDirectDownload` is true.
     *
     * @default
     * false
     */
    autoInstall?: boolean
}

export type UpdatesFetcher = () => Promise<UpdatesFetcherResponse | null>

export interface ClientUpdatesConfig {
    /**
     * @description
     * Function to fetch updates information.
     */
    fetcher: UpdatesFetcher

    /**
     * @description
     * Check for updates every X minutes
     *
     * Value is in minutes.
     *
     * @default
     * 60 minutes
     */
    checkInterval?: number

    /**
     * @description
     * Snooze time in minutes after a successful update check.
     *
     * Value is in minutes.
     *
     * @default
     * 60 minutes
     */
    snoozeTime?: number
}

/**
 * --------------
 * Metadata for the updates config
 * --------------
 */

export interface UpdatesConfigSavedMetadata {
    /**
     * @description
     * Configuration policy for updates.
     */
    config: Required<ClientUpdatesConfig>

    fetcherResponse: UpdatesFetcherResponse

    /**
     * @description
     * Last time the updates were checked, in milliseconds since epoch.
     */
    lastCheck: number

    /**
     * @description
     * Last time the updates were snoozed, in milliseconds since epoch.
     */
    lastSnooze: number | null
}

export enum UpdaterAction {
    /**
     * @description
     * Used as a placeholder for no action.
     */
    NONE = '__fast-alfred_managed__no-action-callback',

    /**
     * @description
     * Update the workflow to the latest version.
     */
    UPDATE = '__fast-alfred_managed__update-callback',

    /**
     * @description
     * Snooze the update for a while.
     */
    SNOOZE = '__fast-alfred_managed__snooze-callback',
}
