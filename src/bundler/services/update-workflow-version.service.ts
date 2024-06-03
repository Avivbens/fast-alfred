import { readWorkflowMetadata, writeWorkflowMetadata } from '@common/workflow-metadata.service'
import { readWorkflowPackageJson, writeWorkflowPackageJson } from '@common/workflow-package-json.service'
import type { WorkflowMetadata } from '@models/workflow-metadata.model'

export async function updateWorkflowMetadataVersion(version: string) {
    const currentConfig = await readWorkflowMetadata()

    const newConfig: WorkflowMetadata = {
        ...currentConfig,
        version,
    }

    await writeWorkflowMetadata(newConfig)
}

export async function updateWorkflowPackageJsonVersion(version: string) {
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
