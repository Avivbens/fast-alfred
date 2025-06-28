/* eslint-disable @typescript-eslint/no-var-requires */
import { glob } from 'glob'
import { readConfigFile } from '@common/user-config.service'
import { readWorkflowMetadata, writeWorkflowMetadata } from '@common/workflow-metadata.service'
import { workflowMock } from './mocks/workflow.mock'
import { includeUpdatesHelpers } from './updates-helpers.service'

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
        expect(finalWorkflow.objects.some((o: any) => o.uid.includes('__fast-alfred_managed__'))).toBe(true)
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
        const conditionalUid = `__fast-alfred_managed__conditional_${originalScriptFilterUid}`

        // Original script filter now connects to the conditional object
        expect(finalWorkflow.connections[originalScriptFilterUid]).toEqual([
            {
                destinationuid: conditionalUid,
                modifiers: 0,
                modifiersubtext: '',
                vitoclose: false,
            },
        ])

        const conditionalConnections = finalWorkflow.connections[conditionalUid]
        expect(conditionalConnections).toHaveLength(3)

        // Conditional object connects to update helpers
        expect(conditionalConnections).toContainEqual(
            expect.objectContaining({
                destinationuid: '__fast-alfred_managed__updater_workflow-update',
                sourceoutputuid: `__fast-alfred_managed__condition_${originalScriptFilterUid}`,
            }),
        )

        // Conditional object connects to original destination on 'else'
        expect(conditionalConnections).toContainEqual(
            expect.objectContaining({
                destinationuid: 'FD52D6DE-838E-4CEF-9D97-F47BAC0D8F71',
            }),
        )

        const elseConnection = conditionalConnections.find(
            (c: any) => c.destinationuid === 'FD52D6DE-838E-4CEF-9D97-F47BAC0D8F71',
        )
        expect(elseConnection).not.toHaveProperty('sourceoutputuid')
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
