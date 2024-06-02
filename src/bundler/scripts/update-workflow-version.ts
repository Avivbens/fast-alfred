#!/usr/bin/env node
import { coerce, valid } from 'semver'
import { readWorkflowMetadata, writeWorkflowMetadata } from '@common/workflow-metadata.service'
import type { WorkflowMetadata } from '@models/workflow-metadata.model'

;(async () => {
    const [targetVersion] = process.argv.slice(2)
    if (!targetVersion) {
        throw new Error('No target version provided')
    }

    const parsedVersion = coerce(targetVersion)
    const validatedVersion = valid(parsedVersion)

    if (!validatedVersion) {
        throw new Error(`Invalid version - ${targetVersion}`)
    }

    const currentConfig = await readWorkflowMetadata()

    const newConfig: WorkflowMetadata = {
        ...currentConfig,
        version: validatedVersion,
    }

    await writeWorkflowMetadata(newConfig)
})()
