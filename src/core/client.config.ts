import { release, version } from 'node:os'
import { platform } from 'node:process'
import type { AlfredListItem } from '@models/alfred-list-item.model'
import type {
    SnoozeScriptArgs,
    UpdateScriptArgs,
    UpdatesConfig,
    UpdatesConfigSavedMetadata,
} from '@models/updates-config.model'
import { IconService } from './services/icon.service'

export const ERROR_MESSAGE = ({
    error,
    workflowName,
    workflowVersion,
    alfredVersion,
}: {
    error: Error
    workflowName: string
    workflowVersion: string
    alfredVersion: string
}) =>
    `
\`\`\`
${error.stack}
\`\`\`

---------- metadata ----------

${workflowName} - version: ${workflowVersion}
Alfred ${alfredVersion}
${platform} ${release()}

${version()}

------------------------------
`.trim()

/**
 * Updates mechanism configuration
 */

export const METADATA_CACHE_KEY = `__fast-alfred__updates-config-metadata__`

export const DEFAULT_UPDATES_CONFIG: Required<Omit<UpdatesConfig, 'fetcher'>> = {
    checkInterval: 60, // 60 minutes
    snoozeTime: 60, // 60 minutes
}

export const UPDATE_ITEM = (metadata: UpdatesConfigSavedMetadata): AlfredListItem => {
    const iconsService = new IconService()

    const { latestVersion, latestDownloadUrl, config } = metadata
    const { snoozeTime } = config

    /**
     * Update detected, need to notify the user
     */
    const updateArgs: UpdateScriptArgs = { latestDownloadUrl }
    const snoozeArgs: SnoozeScriptArgs = {
        snoozeTime,
        lastSnooze: Date.now(),
    }

    const updateItem: AlfredListItem = {
        title: `Update available: ${latestVersion}`,
        subtitle: `Click to download the latest version of the workflow.`,
        valid: Boolean(latestDownloadUrl), // TODO - validate user has experimental helpers for updates
        arg: JSON.stringify(updateArgs),
        icon: {
            path: iconsService.getIcon('sync'),
        },
        mods: {
            cmd: {
                subtitle: 'Snooze this update for a while',
                arg: JSON.stringify(snoozeArgs),
                valid: true,
            },
        },
    }

    return updateItem
}
