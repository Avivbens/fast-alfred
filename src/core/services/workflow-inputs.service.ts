import { readFileSync } from 'node:fs'
import { argv, env } from 'node:process'
import { ARGS_STDIN_VARIABLE } from '../client.config'

const stdinInputs = loadStdinInputs()

export function readWorkflowInputs(): string[] {
    if (!stdinInputs) {
        return argv.slice(2)
    }

    return [...stdinInputs]
}

/**
 * Runs once at load, before the script can touch stdin or spawn a child that would inherit the flag and wait on a
 * stdin nobody writes
 */
function loadStdinInputs(): string[] | undefined {
    const piped = env[ARGS_STDIN_VARIABLE] === '1'
    delete env[ARGS_STDIN_VARIABLE]

    if (!piped) {
        return undefined
    }

    const raw = readFileSync(0, 'utf8')

    return raw.split('\0').slice(0, -1)
}
