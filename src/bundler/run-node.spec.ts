import { type SpawnSyncReturns, spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'
import { ARGS_STDIN_VARIABLE } from '../core/client.config'

const RUN_NODE = resolve(__dirname, 'assets/run-node.sh')

/**
 * Prints what node received, so the spec pins the runner's wire format rather than the client's parsing
 */
const ECHO_SCRIPT = `
const { readFileSync } = require('node:fs')
const flag = process.env.${ARGS_STDIN_VARIABLE} ?? null
const stdin = flag === '1' ? readFileSync(0, 'utf8') : null
process.stdout.write(JSON.stringify({ argv: process.argv.slice(2), flag, stdin }))
`

const fixturesDir = mkdtempSync(join(tmpdir(), 'fast-alfred-run-node-'))
const echoScript = join(fixturesDir, 'echo.cjs')
const failScript = join(fixturesDir, 'fail.cjs')
writeFileSync(echoScript, ECHO_SCRIPT)
writeFileSync(failScript, 'process.exit(3)')

function runNode(script: string, args: string[], env: NodeJS.ProcessEnv = process.env): SpawnSyncReturns<string> {
    return spawnSync('bash', [RUN_NODE, script, ...args], { encoding: 'utf8', env })
}

describe('run-node.sh', () => {
    afterAll(() => {
        rmSync(fixturesDir, { recursive: true, force: true })
    })

    it('should keep the arguments off node command line and pipe them over stdin', () => {
        const args = ['Hi Andy!\n\nI checked the code', 'it\'s "quoted" ✨ $HOME `pwd`', '']

        const { stdout } = runNode(echoScript, args)

        expect(JSON.parse(stdout)).toEqual({ argv: [], flag: '1', stdin: `${args.join('\0')}\0` })
    })

    it('should run node without stdin when Alfred passes no arguments', () => {
        const { stdout } = runNode(echoScript, [])

        expect(JSON.parse(stdout)).toEqual({ argv: [], flag: null, stdin: null })
    })

    it('should not pass on an inherited flag, which would leave node waiting on stdin', () => {
        const env = { ...process.env, [ARGS_STDIN_VARIABLE]: '1' }

        const { stdout } = runNode(echoScript, [], env)

        expect(JSON.parse(stdout)).toEqual({ argv: [], flag: null, stdin: null })
    })

    it('should exit with the node exit code, so Alfred still reports a failed script', () => {
        const { status } = runNode(failScript, ['grammar'])

        expect(status).toBe(3)
    })
})
