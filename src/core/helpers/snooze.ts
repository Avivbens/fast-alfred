import { UpdaterAction, type UpdatesConfigSavedMetadata } from '@models/client-updates-config.model'
import { UPDATES_METADATA_KEY } from '../client.config'
import { FastAlfred } from '../fast-alfred.client'

;(async () => {
    const alfredClient = new FastAlfred()
    alfredClient.log('Running snooze...')

    const action = alfredClient.input
    if (action !== UpdaterAction.SNOOZE) {
        alfredClient.log(`Action "${action}" not matching expected "${UpdaterAction.SNOOZE}"`)
        return
    }

    const currentMetadata = alfredClient.cache.get<UpdatesConfigSavedMetadata>(UPDATES_METADATA_KEY)
    if (!currentMetadata) {
        alfredClient.log('No metadata found in cache, cannot snooze updates.')
        return
    }

    const { config, lastSnooze } = currentMetadata
    const { snoozeTime } = config

    if (lastSnooze && Date.now() - lastSnooze < snoozeTime * 60_000) {
        alfredClient.log(`Already snoozed updates for ${snoozeTime} minutes, skipping snoozing again`)
        return
    }

    /**
     * Update the last snooze time
     */
    const metadata: UpdatesConfigSavedMetadata = {
        ...currentMetadata,
        lastSnooze: Date.now(),
    }

    alfredClient.cache.setWithTTL(UPDATES_METADATA_KEY, metadata, {
        maxAge: currentMetadata.config.checkInterval * 60 * 1000,
    })
})()
