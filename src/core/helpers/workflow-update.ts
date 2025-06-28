import { homedir } from 'node:os'
import { resolve } from 'node:path'
import { execPromise } from '@common/utils'
import type { UpdatesConfigSavedMetadata } from '@models/client-updates-config.model'
import { UpdaterAction } from '@models/client-updates-config.model'
import { UPDATES_METADATA_KEY } from '../client.config'
import { FastAlfred } from '../fast-alfred.client'

function getDesktopPath(): string {
    return resolve(homedir(), 'Desktop')
}

;(async () => {
    const alfredClient = new FastAlfred()
    alfredClient.log('Running workflow update script...')

    const action = alfredClient.input
    if (action !== UpdaterAction.UPDATE) {
        alfredClient.log(`Action "${action}" not matching expected "${UpdaterAction.UPDATE}"`)
        return
    }

    const currentMetadata = alfredClient.cache.get<UpdatesConfigSavedMetadata>(UPDATES_METADATA_KEY)
    if (!currentMetadata) {
        alfredClient.log('No metadata found in cache, cannot snooze updates.')
        return
    }

    const { latestVersion, autoInstall, downloadUrl, isDirectDownload } = currentMetadata.fetcherResponse
    if (!downloadUrl) {
        alfredClient.log('No download URL provided, cannot update workflow.')
        return
    }

    if (!isDirectDownload) {
        // Open the download URL in the default browser
        await execPromise(`open ${downloadUrl}`)
        return
    }

    /**
     * Direct download, no need to open a URL
     */
    const sanitizedVersion = latestVersion.replace(/\//g, '-')

    const fileName = `${sanitizedVersion}_update_${Date.now()}.alfredworkflow`
    const downloadPath = resolve(getDesktopPath(), fileName)

    await execPromise(`curl -L "${downloadUrl}" -o "${downloadPath}"`, { timeout: 10_000 })

    if (!autoInstall) {
        return
    }

    /**
     * Install the new workflow version
     */
    await execPromise(`open "${downloadPath}"`)
})()
