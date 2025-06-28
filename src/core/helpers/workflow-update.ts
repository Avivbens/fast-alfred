import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { execPromise } from '@common/utils'
import type { UpdatesConfigSavedMetadata } from '@models/client-updates-config.model'
import { UpdaterAction } from '@models/client-updates-config.model'
import { METADATA_CACHE_KEY } from '../client.config'
import { FastAlfred } from '../fast-alfred.client'

;(async () => {
    const alfredClient = new FastAlfred()
    alfredClient.log('Running workflow update script...')

    const action = alfredClient.input
    if (action !== UpdaterAction.UPDATE) {
        return
    }

    const currentMetadata = alfredClient.cache.get<UpdatesConfigSavedMetadata>(METADATA_CACHE_KEY)
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
    const tempDir = tmpdir()
    const fileName = `fast-alfred-update-${latestVersion}_${Date.now()}.zip`
    const downloadPath = resolve(tempDir, fileName)

    await execPromise(`curl -L ${downloadUrl} -o ${downloadPath}`, { timeout: 10_000 })

    if (!autoInstall) {
        return
    }

    /**
     * Install the new workflow version
     */
    await execPromise(`unzip -o ${downloadPath}`)

    const workflowFile = resolve(tempDir, '*.alfredworkflow')
    await execPromise(`open ${workflowFile}`)
})()
