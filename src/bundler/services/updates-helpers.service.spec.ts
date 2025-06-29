/* eslint-disable @typescript-eslint/no-var-requires */
import { glob } from 'glob'
import { readConfigFile } from '@common/user-config.service'
import { readWorkflowMetadata, writeWorkflowMetadata } from '@common/workflow-metadata.service'
import { workflowMock } from './mocks/workflow.mock'
import {
    CONDITIONAL_CONDITION_UID,
    CONDITIONAL_OBJECT_UID,
    DEPRECATED_CONDITIONAL_OBJECT_UID,
    MANAGED_BY_FAST_ALFRED_PREFIX,
    UPDATER_SNOOZE_UID,
    UPDATER_WORKFLOW_UPDATE_UID,
    dropUpdateHelpers,
    includeUpdatesHelpers,
} from './updates-helpers.service'

jest.mock('glob')
jest.mock('@common/user-config.service')
jest.mock('@common/workflow-metadata.service')
jest.mock('../utils/bundler.utils')

describe('includeUpdatesHelpers', () => {
    const globMock = glob as unknown as jest.Mock
    const readConfigFileMock = readConfigFile as jest.Mock
    const readWorkflowMetadataMock = readWorkflowMetadata as jest.Mock
    const writeWorkflowMetadataMock = writeWorkflowMetadata as jest.Mock
    const buildOptionsMock = require('../utils/bundler.utils').buildOptions as jest.Mock

    beforeEach(() => {
        jest.clearAllMocks()

        buildOptionsMock.mockResolvedValue({
            targetDir: 'esbuild',
            assetsDir: 'assets',
            productionScripts: ['src/bookmarks.ts'],
        })

        globMock.mockResolvedValue(['src/bookmarks.ts'])
    })

    it('should not do anything if not enabled', async () => {
        readConfigFileMock.mockResolvedValue({
            updates: {
                bundleHelpers: false,
            },
        })

        await includeUpdatesHelpers()

        expect(writeWorkflowMetadataMock).not.toHaveBeenCalled()
    })

    it('should not do anything if productionScripts is empty', async () => {
        readConfigFileMock.mockResolvedValue({
            updates: {
                bundleHelpers: true,
            },
        })
        buildOptionsMock.mockResolvedValue({
            targetDir: 'esbuild',
            assetsDir: 'assets',
            productionScripts: [],
        })

        await includeUpdatesHelpers()

        expect(writeWorkflowMetadataMock).not.toHaveBeenCalled()
    })

    it('should correctly identify script with arguments', async () => {
        readConfigFileMock.mockResolvedValue({
            updates: {
                bundleHelpers: true,
            },
        })
        const mockWithArgs = JSON.parse(JSON.stringify(workflowMock))
        const scriptFilterWithArgsUid = 'CE84ED38-CD11-4B81-9E07-91C9D10EEE3C'
        const originalDestinationUid = 'FD52D6DE-838E-4CEF-9D97-F47BAC0D8F71'
        mockWithArgs.objects[2].config.script = `node esbuild/bookmarks.js {query}`
        readWorkflowMetadataMock.mockResolvedValue(mockWithArgs)

        await includeUpdatesHelpers()

        expect(writeWorkflowMetadataMock).toHaveBeenCalledTimes(1)
        const finalWorkflow = writeWorkflowMetadataMock.mock.calls[0][0]
        const conditionalUid = CONDITIONAL_OBJECT_UID(scriptFilterWithArgsUid, originalDestinationUid)
        // Check that the connection was correctly re-wired from the script filter with args
        expect(finalWorkflow.connections[scriptFilterWithArgsUid][0].destinationuid).toBe(conditionalUid)
    })

    it('should add updater helpers and conditional objects when enabled', async () => {
        readConfigFileMock.mockResolvedValue({
            updates: {
                bundleHelpers: true,
            },
        })
        readWorkflowMetadataMock.mockResolvedValue(JSON.parse(JSON.stringify(workflowMock)))

        await includeUpdatesHelpers()

        expect(writeWorkflowMetadataMock).toHaveBeenCalledTimes(1)
        const finalWorkflow = writeWorkflowMetadataMock.mock.calls[0][0]

        expect(finalWorkflow.objects).toHaveLength(7)
        expect(finalWorkflow.objects.some((o: any) => o.uid.includes(MANAGED_BY_FAST_ALFRED_PREFIX))).toBe(true)
    })

    it('should correctly re-wire connections', async () => {
        readConfigFileMock.mockResolvedValue({
            updates: {
                bundleHelpers: true,
            },
        })
        readWorkflowMetadataMock.mockResolvedValue(JSON.parse(JSON.stringify(workflowMock)))

        await includeUpdatesHelpers()

        const finalWorkflow = writeWorkflowMetadataMock.mock.calls[0][0]
        const originalScriptFilterUid = 'CE84ED38-CD11-4B81-9E07-91C9D10EEE3C'
        const originalDestinationUid = 'FD52D6DE-838E-4CEF-9D97-F47BAC0D8F71'
        const conditionalUid = CONDITIONAL_OBJECT_UID(originalScriptFilterUid, originalDestinationUid)
        const conditionUid = CONDITIONAL_CONDITION_UID(originalScriptFilterUid, originalDestinationUid)

        // Original script filter now connects to the conditional object
        expect(finalWorkflow.connections[originalScriptFilterUid]).toEqual([
            {
                destinationuid: conditionalUid,
                modifiers: 0,
                modifiersubtext: '',
                vitoclose: true,
            },
        ])

        const conditionalConnections = finalWorkflow.connections[conditionalUid]
        expect(conditionalConnections).toHaveLength(3)

        // Conditional object connects to update helpers
        expect(conditionalConnections).toContainEqual(
            expect.objectContaining({
                destinationuid: UPDATER_WORKFLOW_UPDATE_UID,
                sourceoutputuid: conditionUid,
            }),
        )

        // Conditional object connects to snooze helper
        expect(conditionalConnections).toContainEqual(
            expect.objectContaining({
                destinationuid: UPDATER_SNOOZE_UID,
                sourceoutputuid: conditionUid,
            }),
        )

        // Conditional object connects to original destination on 'else'
        expect(conditionalConnections).toContainEqual(
            expect.objectContaining({
                destinationuid: originalDestinationUid,
            }),
        )

        const elseConnection = conditionalConnections.find((c: any) => c.destinationuid === originalDestinationUid)
        expect(elseConnection).not.toHaveProperty('sourceoutputuid')
    })

    it('should correctly re-wire multiple outgoing connections', async () => {
        readConfigFileMock.mockResolvedValue({
            updates: {
                bundleHelpers: true,
            },
        })
        const mockWithMultipleConnections = JSON.parse(JSON.stringify(workflowMock))
        const originalScriptFilterUid = 'CE84ED38-CD11-4B81-9E07-91C9D10EEE3C'
        const originalDestination1 = 'FD52D6DE-838E-4CEF-9D97-F47BAC0D8F71'
        const originalDestination2 = 'ANOTHER-DESTINATION-UID'

        mockWithMultipleConnections.connections[originalScriptFilterUid].push({
            destinationuid: originalDestination2,
            modifiers: 0,
            modifiersubtext: '',
            vitoclose: false,
        })
        readWorkflowMetadataMock.mockResolvedValue(mockWithMultipleConnections)

        await includeUpdatesHelpers()

        const finalWorkflow = writeWorkflowMetadataMock.mock.calls[0][0]
        const conditionalUid1 = CONDITIONAL_OBJECT_UID(originalScriptFilterUid, originalDestination1)
        const conditionalUid2 = CONDITIONAL_OBJECT_UID(originalScriptFilterUid, originalDestination2)

        // Original script filter now has two connections, one for each new conditional object
        expect(finalWorkflow.connections[originalScriptFilterUid]).toHaveLength(2)
        expect(finalWorkflow.connections[originalScriptFilterUid].map((c: any) => c.destinationuid)).toEqual(
            expect.arrayContaining([conditionalUid1, conditionalUid2]),
        )

        // Check connections from the first conditional
        const conditionalConnections1 = finalWorkflow.connections[conditionalUid1]
        const elseConnection1 = conditionalConnections1.find((c: any) => !c.sourceoutputuid)
        expect(elseConnection1.destinationuid).toBe(originalDestination1)

        // Check connections from the second conditional
        const conditionalConnections2 = finalWorkflow.connections[conditionalUid2]
        const elseConnection2 = conditionalConnections2.find((c: any) => !c.sourceoutputuid)
        expect(elseConnection2.destinationuid).toBe(originalDestination2)
    })

    it('should preserve modifier keys on re-wired connections', async () => {
        readConfigFileMock.mockResolvedValue({
            updates: {
                bundleHelpers: true,
            },
        })
        const mockWithModifiers = JSON.parse(JSON.stringify(workflowMock))
        const originalScriptFilterUid = 'CE84ED38-CD11-4B81-9E07-91C9D10EEE3C'
        const originalDestinationUid = 'FD52D6DE-838E-4CEF-9D97-F47BAC0D8F71'
        mockWithModifiers.connections[originalScriptFilterUid][0] = {
            destinationuid: originalDestinationUid,
            modifiers: 1048576, // CMD
            modifiersubtext: 'Open in browser',
            vitoclose: true,
        }
        readWorkflowMetadataMock.mockResolvedValue(mockWithModifiers)

        await includeUpdatesHelpers()

        const finalWorkflow = writeWorkflowMetadataMock.mock.calls[0][0]
        const conditionalUid = CONDITIONAL_OBJECT_UID(originalScriptFilterUid, originalDestinationUid)

        // Connection to conditional preserves modifiers
        const toConditionalConnection = finalWorkflow.connections[originalScriptFilterUid][0]
        expect(toConditionalConnection.modifiers).toBe(1048576)
        expect(toConditionalConnection.modifiersubtext).toBe('Open in browser')

        // 'Else' connection from conditional preserves modifiers
        const fromConditionalConnection = finalWorkflow.connections[conditionalUid].find(
            (c: any) => c.destinationuid === originalDestinationUid,
        )
        expect(fromConditionalConnection.modifiers).toBe(1048576)
        expect(fromConditionalConnection.modifiersubtext).toBe('Open in browser')
    })

    it('should be idempotent', async () => {
        readConfigFileMock.mockResolvedValue({
            updates: {
                bundleHelpers: true,
            },
        })
        readWorkflowMetadataMock.mockResolvedValue(JSON.parse(JSON.stringify(workflowMock)))

        // Run once
        await includeUpdatesHelpers()
        const firstRunResult = writeWorkflowMetadataMock.mock.calls[0][0]
        writeWorkflowMetadataMock.mockClear()

        // Prep for second run
        readWorkflowMetadataMock.mockResolvedValue(JSON.parse(JSON.stringify(firstRunResult)))

        // Run again
        await includeUpdatesHelpers()
        const secondRunResult = writeWorkflowMetadataMock.mock.calls[0][0]

        expect(secondRunResult).toEqual(firstRunResult)
    })
})

describe('dropUpdateHelpers', () => {
    const readConfigFileMock = readConfigFile as jest.Mock
    const readWorkflowMetadataMock = readWorkflowMetadata as jest.Mock
    const writeWorkflowMetadataMock = writeWorkflowMetadata as jest.Mock

    beforeEach(() => {
        jest.clearAllMocks()
        readConfigFileMock.mockResolvedValue({
            updates: {
                bundleHelpers: true,
            },
        })
    })

    it('should correctly restore original connections with modifier keys', async () => {
        const mockWithModifiers = JSON.parse(JSON.stringify(workflowMock))
        const originalScriptFilterUid = 'CE84ED38-CD11-4B81-9E07-91C9D10EEE3C'
        const originalConnection = {
            destinationuid: 'FD52D6DE-838E-4CEF-9D97-F47BAC0D8F71',
            modifiers: 1048576, // CMD
            modifiersubtext: 'Open in browser',
            vitoclose: true,
        }
        mockWithModifiers.connections[originalScriptFilterUid] = [originalConnection]
        readWorkflowMetadataMock.mockResolvedValue(mockWithModifiers)

        // First, include helpers to get a modified workflow
        await includeUpdatesHelpers()
        const modifiedWorkflow = writeWorkflowMetadataMock.mock.calls[0][0]
        writeWorkflowMetadataMock.mockClear()

        // Now, drop them
        readWorkflowMetadataMock.mockResolvedValue(modifiedWorkflow)
        await dropUpdateHelpers()

        const finalWorkflow = writeWorkflowMetadataMock.mock.calls[0][0]
        expect(finalWorkflow.connections[originalScriptFilterUid]).toEqual([originalConnection])
    })

    it('should correctly restore multiple original connections', async () => {
        const mockWithMultipleConnections = JSON.parse(JSON.stringify(workflowMock))
        const originalScriptFilterUid = 'CE84ED38-CD11-4B81-9E07-91C9D10EEE3C'
        const originalConnections = [
            {
                destinationuid: 'FD52D6DE-838E-4CEF-9D97-F47BAC0D8F71',
                modifiers: 0,
                modifiersubtext: '',
                vitoclose: true,
            },
            {
                destinationuid: 'ANOTHER-DESTINATION-UID',
                modifiers: 0,
                modifiersubtext: '',
                vitoclose: false,
            },
        ]
        mockWithMultipleConnections.connections[originalScriptFilterUid] = originalConnections
        readWorkflowMetadataMock.mockResolvedValue(mockWithMultipleConnections)

        await includeUpdatesHelpers()
        const modifiedWorkflow = writeWorkflowMetadataMock.mock.calls[0][0]
        writeWorkflowMetadataMock.mockClear()

        readWorkflowMetadataMock.mockResolvedValue(modifiedWorkflow)
        await dropUpdateHelpers()

        const finalWorkflow = writeWorkflowMetadataMock.mock.calls[0][0]
        expect(finalWorkflow.connections[originalScriptFilterUid]).toEqual(expect.arrayContaining(originalConnections))
        expect(finalWorkflow.connections[originalScriptFilterUid]).toHaveLength(originalConnections.length)
    })

    it('should correctly restore connections from a legacy (v0) helper setup', async () => {
        const mockWithLegacyHelpers = JSON.parse(JSON.stringify(workflowMock))
        const originalScriptFilterUid = 'CE84ED38-CD11-4B81-9E07-91C9D10EEE3C'
        const originalDestinationUid = 'FD52D6DE-838E-4CEF-9D97-F47BAC0D8F71'

        // This is the shape of the old, v0 helper object
        const legacyConditionalUid = DEPRECATED_CONDITIONAL_OBJECT_UID(originalScriptFilterUid)
        const legacyConditionalObject = {
            type: 'alfred.workflow.utility.conditional',
            uid: legacyConditionalUid,
            version: 1,
            config: {},
        }

        // 1. Add the legacy object
        mockWithLegacyHelpers.objects.push(legacyConditionalObject)

        // 2. Rewire the connections to simulate a v0 setup
        mockWithLegacyHelpers.connections[originalScriptFilterUid] = [
            {
                destinationuid: legacyConditionalUid, // from script filter to v0 helper
                modifiers: 0,
                modifiersubtext: '',
                vitoclose: true,
            },
        ]
        mockWithLegacyHelpers.connections[legacyConditionalUid] = [
            {
                destinationuid: originalDestinationUid, // from v0 helper ('else') to original destination
                modifiers: 0,
                modifiersubtext: '',
                vitoclose: true,
                sourceoutputuid: undefined, // Important for 'else' case
            },
            {
                destinationuid: UPDATER_WORKFLOW_UPDATE_UID, // from v0 helper ('if') to updater
                modifiers: 0,
                modifiersubtext: '',
                vitoclose: false,
                sourceoutputuid: 'some-if-uid',
            },
        ]

        readWorkflowMetadataMock.mockResolvedValue(mockWithLegacyHelpers)

        await dropUpdateHelpers()

        const finalWorkflow = writeWorkflowMetadataMock.mock.calls[0][0]

        // 3. Assert that the connection is restored to its original state
        expect(finalWorkflow.connections[originalScriptFilterUid]).toEqual([
            {
                destinationuid: originalDestinationUid,
                modifiers: 0,
                modifiersubtext: '',
                vitoclose: true,
            },
        ])

        // 4. Assert all helpers are gone
        expect(finalWorkflow.objects.some((o: any) => o.uid.startsWith(MANAGED_BY_FAST_ALFRED_PREFIX))).toBe(false)
        expect(finalWorkflow.connections[legacyConditionalUid]).toBeUndefined()
    })

    it('should be idempotent', async () => {
        const cleanWorkflow = JSON.parse(JSON.stringify(workflowMock))
        readWorkflowMetadataMock.mockResolvedValue(cleanWorkflow)

        await dropUpdateHelpers()

        const finalWorkflow = writeWorkflowMetadataMock.mock.calls[0][0]
        expect(finalWorkflow).toEqual(cleanWorkflow)
    })

    it('should clean up a partially broken run', async () => {
        readWorkflowMetadataMock.mockResolvedValue(JSON.parse(JSON.stringify(workflowMock)))
        await includeUpdatesHelpers()
        const modifiedWorkflow = writeWorkflowMetadataMock.mock.calls[0][0]
        writeWorkflowMetadataMock.mockClear()

        // Break it: remove a connection but leave the objects
        const brokenWorkflow = JSON.parse(JSON.stringify(modifiedWorkflow))
        const originalScriptFilterUid = 'CE84ED38-CD11-4B81-9E07-91C9D10EEE3C'
        delete brokenWorkflow.connections[DEPRECATED_CONDITIONAL_OBJECT_UID(originalScriptFilterUid)]

        readWorkflowMetadataMock.mockResolvedValue(brokenWorkflow)
        await dropUpdateHelpers()

        const finalWorkflow = writeWorkflowMetadataMock.mock.calls[0][0]

        // Should be back to the original state
        expect(finalWorkflow.objects.some((o: any) => o.uid.includes(MANAGED_BY_FAST_ALFRED_PREFIX))).toBe(false)
        expect(Object.keys(finalWorkflow.connections).every((k) => !k.includes(MANAGED_BY_FAST_ALFRED_PREFIX))).toBe(
            true,
        )
        expect(Object.keys(finalWorkflow.uidata).every((k) => !k.includes(MANAGED_BY_FAST_ALFRED_PREFIX))).toBe(true)
    })
})
