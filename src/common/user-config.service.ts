import { access } from 'node:fs/promises'
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
\x1b[33m
No config file found for 'fast-alfred' 🚀
Taking default values!

In order to modify 'fast-alfred', please create a '${CONFIG_FILE_NAME}' file in the root of your project.

You can run the following command to create the file:

\`\`\`bash
echo "${INITIAL_CONFIG.replaceAll('\n', '\\n')}" > ${CONFIG_FILE_NAME}
\`\`\`
\x1b[0m\n
`.trim()

const DEFAULT_ERROR_MESSAGE = (error: Error) =>
    `
\x1b[31m

'fast-alfred' 🚀
Error reading config file: ${error.message}

\x1b[0m
`.trim()

/**
 * Get config file from the current working directory
 * @returns user config file, or an empty object if not found
 */
export async function readConfigFile(): Promise<FastAlfredConfig> {
    try {
        const filePath = resolve(cwd(), CONFIG_FILE_NAME)
        const isExists = await access(filePath)
            .then(() => true)
            .catch(() => false)

        if (!isExists) {
            console.warn(DEFAULT_NOT_FOUND_MESSAGE)
            return {}
        }

        const userConfig = (await import(filePath)).default as FastAlfredConfig
        return userConfig
    } catch (error) {
        console.error(DEFAULT_ERROR_MESSAGE(error))
        throw error
    }
}
