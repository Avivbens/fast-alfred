import { release, version } from 'node:os'
import { platform } from 'node:process'
import type { AlfredListItem } from '@models/alfred-list-item.model'
import {
    type ClientUpdatesConfig,
    UpdaterAction,
    type UpdatesConfigSavedMetadata,
} from '@models/client-updates-config.model'
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

export const DEFAULT_UPDATES_CONFIG: Required<Omit<ClientUpdatesConfig, 'fetcher'>> = {
    checkInterval: 60 * 24, // 24 hours
    snoozeTime: 60 * 24 * 3, // 3 days
}

export const UPDATE_ITEM = (metadata: UpdatesConfigSavedMetadata, currentVersion: string): AlfredListItem => {
    const iconsService = new IconService()

    const { fetcherResponse } = metadata
    const { latestVersion, downloadUrl } = fetcherResponse

    const downloadAvailable = Boolean(downloadUrl)

    const subtitle = `New version ${latestVersion} is available. ⌘+↵ to update, ⌥+↵ to snooze.`
    const updateItem: AlfredListItem = {
        title: `Update available (current: ${currentVersion})`,
        subtitle,
        arg: UpdaterAction.NONE,
        icon: {
            path: iconsService.getIcon('sync'),
        },
        mods: {
            cmd: {
                subtitle: downloadAvailable ? 'Update the workflow' : 'No link available for download',
                arg: UpdaterAction.UPDATE,
                valid: Boolean(downloadUrl),
            },
            alt: {
                subtitle: 'Snooze this update for a while',
                arg: UpdaterAction.SNOOZE,
                valid: true,
            },
        },
    }

    return updateItem
}
