#!/usr/bin/env node
import { coerce, valid } from 'semver'
import { readWorkflowMetadata, writeWorkflowMetadata } from '@common/workflow-metadata.service'
import { readWorkflowPackageJson, writeWorkflowPackageJson } from '@common/workflow-package-json.service'
import type { WorkflowMetadata } from '@models/workflow-metadata.model'

async function updateWorkflowMetadataVersion(version: string) {
    const currentConfig = await readWorkflowMetadata()

    const newConfig: WorkflowMetadata = {
        ...currentConfig,
        version,
    }

    await writeWorkflowMetadata(newConfig)
}

async function updateWorkflowPackageJsonVersion(version: string) {
    const [currentPackageJson, currentPackageLockJson] = await Promise.all([
        readWorkflowPackageJson(),
        readWorkflowPackageJson({ lockfile: true }),
    ])

    const newPackageJson = {
        ...currentPackageJson,
        version,
    }

    const newPackageLockJson = {
        ...currentPackageLockJson,
        version,
    }

    await writeWorkflowPackageJson(newPackageJson)
    await writeWorkflowPackageJson(newPackageLockJson, { lockfile: true })
}

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

    await updateWorkflowMetadataVersion(validatedVersion)
    await updateWorkflowPackageJsonVersion(validatedVersion)
})()
