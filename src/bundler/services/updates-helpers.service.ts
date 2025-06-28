import { glob } from 'glob'
import { basename, extname, join } from 'node:path'
import { readConfigFile } from '@common/user-config.service'
import { readWorkflowMetadata, writeWorkflowMetadata } from '@common/workflow-metadata.service'
import type { UpdatesConfig } from '@models/updates-config.model'
import type { Connection, WorkflowMetadata, WorkflowObject } from '@models/workflow-metadata.model'
import type { BundlerOptions } from '../models'
import { buildOptions } from '../utils/bundler.utils'

const UPDATER_WORKFLOW_UPDATE_UID = '__fast-alfred_managed__updater_workflow-update'
const UPDATER_SNOOZE_UID = '__fast-alfred_managed__updater_snooze'

const MODIFIERS = {
    NONE: 0,
    CMD: 1048576,
    OPT: 524288,
}

const XPOS_BASE = 1_500
const XPOS_DIFF = 150
const YPOS_BASE = 0

const CONDITIONAL_OBJECT_UID = (from: string) => `__fast-alfred_managed__conditional_${from}`
const CONDITIONAL_CONDITION_UID = (from: string) => `__fast-alfred_managed__condition_${from}`

const CONDITIONAL_OBJECT = (from: string): WorkflowObject => ({
    type: 'alfred.workflow.utility.conditional',
    uid: CONDITIONAL_OBJECT_UID(from),
    version: 1,
    config: {
        conditions: [
            {
                inputstring: '{query}',
                matchcasesensitive: false,
                matchmode: 4,
                matchstring: '__fast-alfred_managed_',
                outputlabel: 'Managed versions updates',
                uid: CONDITIONAL_CONDITION_UID(from),
            },
        ],
        elselabel: 'else',
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
        destinationuid: newObjectUid,
        modifiers: MODIFIERS.NONE,
        modifiersubtext: '',
        vitoclose: false,
        ...options,
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

export async function includeUpdatesHelpers(): Promise<void> {
    const [workflow, bundlerOptions, { updates }] = await Promise.all([
        readWorkflowMetadata(),
        buildOptions(),
        readConfigFile(),
    ])

    const isEnabled = await isExperimentalUpdatesHelpersEnabled(updates)
    if (!isEnabled) {
        return
    }

    const targetUids = await getTargetUids(updates, bundlerOptions, workflow)
    if (!targetUids.length) {
        return
    }

    const { targetDir, assetsDir } = bundlerOptions
    const targetDirName = basename(targetDir)
    const assetsDirName = basename(assetsDir)

    const targetUidsCount = targetUids.length
    upsertWorkflowObject(workflow, WORKFLOW_UPDATE_OBJECT(targetDirName, assetsDirName), {
        note: 'Workflow Update Helper',
        xpos: XPOS_BASE + XPOS_DIFF * 2,
        ypos: YPOS_BASE + targetUidsCount * XPOS_DIFF,
    })
    upsertWorkflowObject(workflow, SNOOZE_OBJECT(targetDirName, assetsDirName), {
        note: 'Snooze Updates Helper',
        xpos: XPOS_BASE + XPOS_DIFF * 2,
        ypos: YPOS_BASE + targetUidsCount * XPOS_DIFF + XPOS_DIFF,
    })

    /**
     * Add connections for the new objects to all target UIDs.
     */
    for (const uid of targetUids) {
        const conditionalObject = CONDITIONAL_OBJECT(uid)
        const conditionalUid = conditionalObject.uid
        const conditionUid = conditionalObject.config.conditions?.[0].uid

        /**
         * Upsert the conditional object to the workflow.
         */
        const originalObjectUiData = workflow.uidata[uid]
        upsertWorkflowObject(workflow, conditionalObject, {
            note: 'Conditional Updates Helper',
            xpos: originalObjectUiData.xpos + XPOS_DIFF,
            ypos: originalObjectUiData.ypos,
        })

        const originalConnections = [...(workflow.connections[uid] || [])].filter(
            (conn) => conn.destinationuid !== conditionalUid,
        )
        workflow.connections[uid] = []

        // Connect the script filter to the conditional object
        upsertWorkflowConnection(workflow, conditionalUid, uid)

        // Connect the conditional object to the update helpers
        upsertWorkflowConnection(workflow, UPDATER_WORKFLOW_UPDATE_UID, conditionalUid, {
            ...(conditionUid ? { sourceoutputuid: conditionUid } : {}),
        })
        upsertWorkflowConnection(workflow, UPDATER_SNOOZE_UID, conditionalUid, {
            ...(conditionUid ? { sourceoutputuid: conditionUid } : {}),
        })

        // Re-connect the original connections from the conditional object (else case)
        for (const conn of originalConnections) {
            upsertWorkflowConnection(workflow, conn.destinationuid, conditionalUid, {
                ...conn,
                sourceoutputuid: undefined,
            })
        }
    }

    await writeWorkflowMetadata(workflow)
}
