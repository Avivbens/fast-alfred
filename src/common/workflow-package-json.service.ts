import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { cwd } from 'node:process'
import { DEFAULT_TAB_SIZE } from '@bundler/constants/fast-alfred-options-defaults.config'
import { readConfigFile } from './user-config.service'

const PACKAGE_JSON_FILE = 'package.json'
const PACKAGE_JSON_LOCK_FILE = 'package-lock.json'

type Options = { lockfile: boolean }
const DEFAULT_OPTIONS: Options = { lockfile: false }

export async function readWorkflowPackageJson({ lockfile = false }: Options = DEFAULT_OPTIONS): Promise<object> {
    try {
        const filePath = resolve(cwd(), lockfile ? PACKAGE_JSON_LOCK_FILE : PACKAGE_JSON_FILE)

        const rawData = await readFile(filePath, 'utf-8')
        const jsonData = JSON.parse(rawData)

        return jsonData
    } catch (error) {
        console.error(`Error reading workflow package.json: ${error.stack}`)
        throw error
    }
}

export async function writeWorkflowPackageJson(data: object, { lockfile = false }: Options = DEFAULT_OPTIONS) {
    try {
        const { tabSize } = await readConfigFile()

        const filePath = resolve(cwd(), lockfile ? PACKAGE_JSON_LOCK_FILE : PACKAGE_JSON_FILE)

        const dataToWrite = JSON.stringify(data, null, tabSize ?? DEFAULT_TAB_SIZE)

        await writeFile(filePath, dataToWrite)
    } catch (error) {
        console.error(`Error writing workflow package.json: ${error.stack}`)
        throw error
    }
}
