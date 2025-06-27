export interface UpdatesFetcherResponse {
    latestVersion: string
    downloadUrl?: string
}

export type UpdatesFetcher = () => Promise<UpdatesFetcherResponse | null>

export interface UpdatesConfig {
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
    config: Required<UpdatesConfig>

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

    /**
     * @description
     * The latest version of the workflow.
     */
    latestVersion: string

    /**
     * @description
     * The latest download URL of the workflow.
     */
    latestDownloadUrl?: string
}

export interface UpdateScriptArgs {
    latestDownloadUrl?: string
}

export interface SnoozeScriptArgs {
    snoozeTime: number
    lastSnooze: number
}
