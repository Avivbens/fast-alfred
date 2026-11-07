import type * as nodeFs from 'node:fs'
import type * as nodeProcess from 'node:process'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ARGS_STDIN_VARIABLE } from '../client.config'
import type * as workflowInputsService from './workflow-inputs.service'

const mocked = vi.hoisted(() => ({
    argv: [] as string[],
    readFileSync: vi.fn(),
}))

vi.mock('node:fs', async (importOriginal) => {
    const actual = await importOriginal<typeof nodeFs>()

    return { ...actual, readFileSync: mocked.readFileSync }
})

vi.mock('node:process', async (importOriginal) => {
    const actual = await importOriginal<typeof nodeProcess>()

    return {
        ...actual,
        get argv() {
            return mocked.argv
        },
    }
})

/**
 * Each case needs a fresh module, since the service reads stdin and the flag as it loads
 */
async function loadService(): Promise<typeof workflowInputsService> {
    vi.resetModules()

    return await import('./workflow-inputs.service.js')
}

describe('workflow-inputs.service', () => {
    beforeEach(() => {
        mocked.argv = ['/usr/local/bin/node', 'esbuild/grammar.js']
    })

    afterEach(() => {
        vi.unstubAllEnvs()
    })

    describe('readWorkflowInputs', () => {
        it('should read argv when the script runs without run-node.sh', async () => {
            mocked.argv = ['/usr/local/bin/node', 'esbuild/find-process.js', 'false', 'cpu', 'chrome']
            const { readWorkflowInputs } = await loadService()

            const inputs = readWorkflowInputs()

            expect(inputs).toEqual(['false', 'cpu', 'chrome'])
            expect(mocked.readFileSync).not.toHaveBeenCalled()
        })

        it('should read argv again on each call, as clients did before stdin', async () => {
            mocked.argv = ['/usr/local/bin/node', 'esbuild/grammar.js', 'first']
            const { readWorkflowInputs } = await loadService()
            readWorkflowInputs()

            mocked.argv = ['/usr/local/bin/node', 'esbuild/grammar.js', 'second']
            const inputs = readWorkflowInputs()

            expect(inputs).toEqual(['second'])
        })

        it('should split the NUL-joined arguments run-node.sh pipes over stdin', async () => {
            vi.stubEnv(ARGS_STDIN_VARIABLE, '1')
            mocked.readFileSync.mockReturnValue('Hi Andy!\n\nI checked the code\0it\'s "quoted" ✨\0\0')
            const { readWorkflowInputs } = await loadService()

            const inputs = readWorkflowInputs()

            expect(inputs).toEqual(['Hi Andy!\n\nI checked the code', 'it\'s "quoted" ✨', ''])
            expect(mocked.readFileSync).toHaveBeenCalledWith(0, 'utf8')
        })

        it('should read stdin once, since a second client in the process would find it drained', async () => {
            vi.stubEnv(ARGS_STDIN_VARIABLE, '1')
            mocked.readFileSync.mockReturnValue('grammar\0')
            const { readWorkflowInputs } = await loadService()

            const first = readWorkflowInputs()
            const second = readWorkflowInputs()

            expect(second).toEqual(first)
            expect(mocked.readFileSync).toHaveBeenCalledTimes(1)
        })

        it('should drop the flag as it loads, so a child spawned before any client does not wait on stdin', async () => {
            vi.stubEnv(ARGS_STDIN_VARIABLE, '1')
            mocked.readFileSync.mockReturnValue('grammar\0')

            await loadService()

            expect(process.env[ARGS_STDIN_VARIABLE]).toBeUndefined()
        })

        it('should hand out copies of the stdin read, so one caller cannot change what another reads', async () => {
            vi.stubEnv(ARGS_STDIN_VARIABLE, '1')
            mocked.readFileSync.mockReturnValue('grammar\0')
            const { readWorkflowInputs } = await loadService()

            readWorkflowInputs().push('extra')
            const inputs = readWorkflowInputs()

            expect(inputs).toEqual(['grammar'])
        })
    })
})
