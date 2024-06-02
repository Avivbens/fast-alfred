import { resolve } from 'node:path'
import { cwd } from 'node:process'
import type { FastAlfredConfig } from '@models/fast-alfred-config.model'

export const CONFIG_FILE_NAME = '.fast-alfred.config.cjs'

const INITIAL_CONFIG = `
/**
 * @type {import('fast-alfred').FastAlfredConfig}
 */
module.exports = {}
`.trim()

const DEFAULT_NOT_FOUND_MESSAGE = `
No config file found for 'fast-alfred' 🚀
Taking default values!

In order to modify 'fast-alfred', please create a '${CONFIG_FILE_NAME}' file in the root of your project.

You can run the following command to create the file:

\`\`\`bash
echo "${INITIAL_CONFIG.replaceAll('\n', '\\n')}" > ${CONFIG_FILE_NAME}
\`\`\`
`

/**
 * Get config file from the current working directory
 * @returns user config file, or an empty object if not found
 */
export async function readConfigFile(): Promise<FastAlfredConfig> {
    try {
        const filePath = resolve(cwd(), CONFIG_FILE_NAME)
        const userConfig = (await import(filePath)).default as FastAlfredConfig
        return userConfig
    } catch (error) {
        console.warn(`\x1b[33m${DEFAULT_NOT_FOUND_MESSAGE}\x1b[0m\n`)
        return {}
    }
}
