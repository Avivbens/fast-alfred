import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { cwd } from 'node:process'
import type { PlistValue } from 'plist'
import { build, parse } from 'plist'
import type { WorkflowMetadata } from '@models/workflow-metadata.model'
import { readConfigFile } from './user-config.service'

const WORKFLOW_METADATA_FILE = 'info.plist'

export async function readWorkflowMetadata(): Promise<WorkflowMetadata> {
    try {
        const filePath = resolve(cwd(), WORKFLOW_METADATA_FILE)

        const rawData = await readFile(filePath, 'utf-8')
        const jsonData = parse(rawData)

        return jsonData as never as WorkflowMetadata
    } catch (error) {
        console.error(`Error reading workflow metadata: ${error.stack}`)
        throw error
    }
}

export async function writeWorkflowMetadata(
    metadata: WorkflowMetadata,
    { ignoreConfigFile = false } = { ignoreConfigFile: false },
) {
    try {
        const { workflowMetadata } = await readConfigFile()

        const filePath = resolve(cwd(), WORKFLOW_METADATA_FILE)

        const dataToWrite = {
            ...metadata,
            ...(ignoreConfigFile ? {} : workflowMetadata ?? {}),
        }

        const plistData = build(dataToWrite as never as PlistValue, { allowEmpty: true, pretty: true })

        await writeFile(filePath, plistData)
    } catch (error) {
        console.error(`Error writing workflow metadata: ${error.stack}`)
        throw error
    }
}
