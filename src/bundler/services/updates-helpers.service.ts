import { glob } from 'glob'
import { basename, extname, join } from 'node:path'
import { readConfigFile } from '@common/user-config.service'
import { readWorkflowMetadata, writeWorkflowMetadata } from '@common/workflow-metadata.service'
import type { UpdatesConfig } from '@models/updates-config.model'
import type { Connection, WorkflowMetadata, WorkflowObject } from '@models/workflow-metadata.model'
import type { BundlerOptions } from '../models'
import { buildOptions } from '../utils/bundler.utils'

export const MANAGED_BY_FAST_ALFRED_PREFIX = '__fast-alfred_managed__'
export const HELPER_UID_VERSION = 'v2'

export const NOTE_WORKFLOW_UPDATE_HELPER = 'Workflow Update Helper'
export const NOTE_SNOOZE_HELPER = 'Snooze Updates Helper'
export const NOTE_CONDITIONAL_HELPER = 'Conditional Updates Helper'

export const CONDITIONAL_ELSE_LABEL = 'Default Behavior'
export const CONDITIONAL_OUTPUT_LABEL = 'Managed versions updates'

export const UPDATER_WORKFLOW_UPDATE_UID = `${MANAGED_BY_FAST_ALFRED_PREFIX}${HELPER_UID_VERSION}_updater_workflow-update`
export const UPDATER_SNOOZE_UID = `${MANAGED_BY_FAST_ALFRED_PREFIX}${HELPER_UID_VERSION}_updater_snooze`

export const MODIFIERS = {
    NONE: 0,
    CMD: 1048576,
    OPT: 524288,
}

export const XPOS_BASE = 1_500
export const XPOS_DIFF = 220
export const YPOS_BASE = 0

/**
 * @deprecated Use ${@link CONDITIONAL_OBJECT_UID} instead. This is kept for backward compatibility during cleanup.
 */
export const DEPRECATED_CONDITIONAL_OBJECT_UID = (from: string) => `${MANAGED_BY_FAST_ALFRED_PREFIX}conditional_${from}`

export const CONDITIONAL_OBJECT_UID = (from: string, to: string) =>
    `${MANAGED_BY_FAST_ALFRED_PREFIX}${HELPER_UID_VERSION}_conditional_from_${from}_to_${to}`

export const CONDITIONAL_CONDITION_UID = (from: string, to: string) =>
    `${MANAGED_BY_FAST_ALFRED_PREFIX}${HELPER_UID_VERSION}_condition_from_${from}_to_${to}`

const CONDITIONAL_OBJECT = (from: string, to: string): WorkflowObject => ({
    type: 'alfred.workflow.utility.conditional',
    uid: CONDITIONAL_OBJECT_UID(from, to),
    version: 1,
    config: {
        conditions: [
            {
                inputstring: '{query}',
                matchcasesensitive: false,
                matchmode: 4,
                matchstring: MANAGED_BY_FAST_ALFRED_PREFIX,
                outputlabel: CONDITIONAL_OUTPUT_LABEL,
                uid: CONDITIONAL_CONDITION_UID(from, to),
            },
        ],
        elselabel: CONDITIONAL_ELSE_LABEL,
        hideelse: false,
    },
})

const WORKFLOW_UPDATE_OBJECT = (targetDir: string, assetsDir: string): WorkflowObject => ({
    type: 'alfred.workflow.action.script',
    uid: UPDATER_WORKFLOW_UPDATE_UID,
    version: 2,
    config: {
        concurrently: false,
        escaping: 102,
        script: `./${targetDir}/${assetsDir}/run-node.sh ${targetDir}/${assetsDir}/workflow-update.js "$1"`,
        scriptargtype: 1,
        scriptfile: '',
        type: 11,
    },
})

const SNOOZE_OBJECT = (targetDir: string, assetsDir: string): WorkflowObject => ({
    type: 'alfred.workflow.action.script',
    uid: UPDATER_SNOOZE_UID,
    version: 2,
    config: {
        concurrently: false,
        escaping: 102,
        script: `./${targetDir}/${assetsDir}/run-node.sh ${targetDir}/${assetsDir}/snooze.js "$1"`,
        scriptargtype: 1,
        scriptfile: '',
        type: 11,
    },
})

/**
 * ---------------------
 */

async function getTargetUids(
    updatesConfig: UpdatesConfig | undefined,
    bundlerOptions: Required<BundlerOptions>,
    workflow: WorkflowMetadata,
): Promise<string[]> {
    const { exclude = [] } = updatesConfig || {}
    const { productionScripts, targetDir } = bundlerOptions

    if (!productionScripts.length) {
        return []
    }

    const sourceFiles = await glob(productionScripts)

    const mainScriptPaths = sourceFiles.map((file) => {
        const suffix = extname(file)
        const baseName = basename(file, suffix)

        const targetedFile = `${baseName}.js`
        const targetDirName = basename(targetDir)
        return join(targetDirName, targetedFile)
    })

    const targetUids: string[] = workflow?.objects
        .filter((obj) => {
            if (obj.type !== 'alfred.workflow.input.scriptfilter') {
                return false
            }

            const { script } = obj.config
            if (!script) {
                return false
            }

            const scriptParts = script.split(' ')
            const scriptPath = scriptParts[1] ?? scriptParts[0]

            if (!scriptPath) {
                return false
            }

            const normalizedScriptPath = scriptPath.replace(/\.js$/, '')

            const scriptIsExcluded = exclude.includes(normalizedScriptPath)
            if (scriptIsExcluded) {
                return false
            }

            return mainScriptPaths.some((mainPath) => {
                const normalizedMainPath = mainPath.replace(/\.js$/, '')
                return normalizedMainPath === normalizedScriptPath
            })
        })
        .map((obj) => obj.uid)

    return targetUids
}

async function isExperimentalUpdatesHelpersEnabled(updatesConfig: UpdatesConfig | undefined): Promise<boolean> {
    const { bundleHelpers } = updatesConfig || {}
    return Boolean(bundleHelpers)
}

function upsertWorkflowObject(
    workflow: WorkflowMetadata,
    newObject: WorkflowObject,
    { xpos, ypos, note }: { note: string; xpos: number; ypos: number },
): void {
    const { uid } = newObject

    const objectIndex = workflow.objects.findIndex((obj) => obj.uid === uid)
    if (objectIndex > -1) {
        workflow.objects[objectIndex] = newObject
    } else {
        workflow.objects.push(newObject)
    }

    workflow.uidata[uid] = {
        xpos,
        ypos,
        note,
    }
}

function upsertWorkflowConnection(
    workflow: WorkflowMetadata,
    newObjectUid: string,
    from: string,
    options: Partial<Connection> = {},
): void {
    if (!workflow.connections[from]) {
        workflow.connections[from] = []
    }

    const connectionObject: Connection = {
        modifiers: MODIFIERS.NONE,
        modifiersubtext: '',
        vitoclose: false,
        ...options,
        // Ensure the destination is the new one
        destinationuid: newObjectUid,
    }

    if (connectionObject.sourceoutputuid === undefined) {
        delete (connectionObject as Partial<Connection>).sourceoutputuid
    }

    const currentConnectionIndex = workflow.connections[from].findIndex(
        (conn) => conn.destinationuid === newObjectUid && conn.sourceoutputuid === options.sourceoutputuid,
    )
    if (currentConnectionIndex > -1) {
        workflow.connections[from][currentConnectionIndex] = connectionObject
        return
    }

    workflow.connections[from].push(connectionObject)
}

function getWorkflowWithDroppedHelpers(workflow: WorkflowMetadata): WorkflowMetadata {
    const newWorkflow = JSON.parse(JSON.stringify(workflow))

    const managedObjects = newWorkflow.objects.filter((obj: WorkflowObject) =>
        obj.uid.startsWith(MANAGED_BY_FAST_ALFRED_PREFIX),
    )

    const v1Parser = new RegExp(`${MANAGED_BY_FAST_ALFRED_PREFIX}conditional_from_(.+)_to_(.+)`)
    const v2Parser = new RegExp(`${MANAGED_BY_FAST_ALFRED_PREFIX}${HELPER_UID_VERSION}_conditional_from_(.+)_to_(.+)`)

    for (const managedObj of managedObjects) {
        const conditionalUid = managedObj.uid
        const match = conditionalUid.match(v2Parser) || conditionalUid.match(v1Parser)

        if (match) {
            // Handles v1 and v2 (per-connection conditional objects)
            const originalFromUid = match[1]
            const originalConnection = (newWorkflow.connections[conditionalUid] || []).find(
                (conn: Connection) => conn.sourceoutputuid === undefined, // This is the 'else' case
            )

            if (originalConnection) {
                upsertWorkflowConnection(
                    newWorkflow,
                    originalConnection.destinationuid,
                    originalFromUid,
                    originalConnection,
                )
            }
        } else if (conditionalUid.startsWith(`${MANAGED_BY_FAST_ALFRED_PREFIX}conditional_`)) {
            // Handles legacy v0 (one conditional for all of a script filter's connections)
            const originalUid = conditionalUid.replace(DEPRECATED_CONDITIONAL_OBJECT_UID(''), '')
            const originalConnections = (newWorkflow.connections[conditionalUid] || []).filter(
                (conn: Connection) => conn.sourceoutputuid === undefined, // else case
            )

            for (const conn of originalConnections) {
                upsertWorkflowConnection(newWorkflow, conn.destinationuid, originalUid, conn)
            }
        }
    }

    /**
     * Remove all helpers objects.
     */
    newWorkflow.objects = newWorkflow.objects.filter(
        (obj: WorkflowObject) => !obj.uid.startsWith(MANAGED_BY_FAST_ALFRED_PREFIX),
    )

    /**
     * Remove all helpers connections.
     */
    for (const uid of Object.keys(newWorkflow.connections)) {
        if (uid.startsWith(MANAGED_BY_FAST_ALFRED_PREFIX)) {
            delete newWorkflow.connections[uid]
            continue
        }

        newWorkflow.connections[uid] = newWorkflow.connections[uid].filter(
            (conn: Connection) => !conn.destinationuid.startsWith(MANAGED_BY_FAST_ALFRED_PREFIX),
        )
    }

    /**
     * Remove all helpers UI data.
     */
    for (const uid of Object.keys(newWorkflow.uidata)) {
        if (uid.startsWith(MANAGED_BY_FAST_ALFRED_PREFIX)) {
            delete newWorkflow.uidata[uid]
        }
    }

    return newWorkflow
}

export async function dropUpdateHelpers(): Promise<void> {
    const workflow = await readWorkflowMetadata()
    const updatedWorkflow = getWorkflowWithDroppedHelpers(workflow)
    await writeWorkflowMetadata(updatedWorkflow)
}

export async function includeUpdatesHelpers(): Promise<void> {
    const [initialWorkflow, bundlerOptions, { updates }] = await Promise.all([
        readWorkflowMetadata(),
        buildOptions(),
        readConfigFile(),
    ])

    const isEnabled = await isExperimentalUpdatesHelpersEnabled(updates)
    if (!isEnabled) {
        return
    }

    const targetUids = await getTargetUids(updates, bundlerOptions, initialWorkflow)
    if (!targetUids.length) {
        return
    }

    const workflow = getWorkflowWithDroppedHelpers(initialWorkflow)

    const { targetDir, assetsDir } = bundlerOptions
    const targetDirName = basename(targetDir)
    const assetsDirName = basename(assetsDir)

    upsertWorkflowObject(workflow, WORKFLOW_UPDATE_OBJECT(targetDirName, assetsDirName), {
        note: NOTE_WORKFLOW_UPDATE_HELPER,
        xpos: XPOS_BASE + XPOS_DIFF * 2,
        ypos: YPOS_BASE,
    })
    upsertWorkflowObject(workflow, SNOOZE_OBJECT(targetDirName, assetsDirName), {
        note: NOTE_SNOOZE_HELPER,
        xpos: XPOS_BASE + XPOS_DIFF * 2,
        ypos: YPOS_BASE + XPOS_DIFF,
    })

    /**
     * Add connections for the new objects to all target UIDs.
     */
    for (const scriptFilterUid of targetUids) {
        const originalConnections = [...(workflow.connections[scriptFilterUid] || [])]
        workflow.connections[scriptFilterUid] = []

        for (const [i, originalConnection] of originalConnections.entries()) {
            const originalDestinationUid = originalConnection.destinationuid

            // Create a new conditional object dedicated to this specific connection
            const conditionalObject = CONDITIONAL_OBJECT(scriptFilterUid, originalDestinationUid)
            const conditionalUid = conditionalObject.uid
            const conditionUid = conditionalObject.config.conditions?.[0].uid

            const originalObjectUiData = workflow.uidata[scriptFilterUid]
            upsertWorkflowObject(workflow, conditionalObject, {
                note: NOTE_CONDITIONAL_HELPER,
                xpos: originalObjectUiData.xpos + XPOS_DIFF,
                ypos: originalObjectUiData.ypos + i * XPOS_DIFF,
            })

            // 1. Re-route original connection to its new dedicated conditional object, preserving all properties (modifiers, etc.)
            upsertWorkflowConnection(workflow, conditionalUid, scriptFilterUid, originalConnection)

            // 2. Connect the conditional's 'else' case back to the original destination
            upsertWorkflowConnection(workflow, originalDestinationUid, conditionalUid, {
                ...originalConnection,
                sourceoutputuid: undefined, // This is the 'else' case
            })

            // 3. Connect the conditional's 'if' case to the update helpers
            if (conditionUid) {
                upsertWorkflowConnection(workflow, UPDATER_WORKFLOW_UPDATE_UID, conditionalUid, {
                    sourceoutputuid: conditionUid,
                })
            }
        }
    }

    // Connect the main update helper to the snooze helper
    upsertWorkflowConnection(workflow, UPDATER_SNOOZE_UID, UPDATER_WORKFLOW_UPDATE_UID)

    await writeWorkflowMetadata(workflow)
}
