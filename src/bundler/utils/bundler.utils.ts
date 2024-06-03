import { globSync } from 'glob'
import merge from 'lodash.merge'
import { copyFile, mkdir, rm } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { cwd } from 'node:process'
import { readConfigFile } from '@common/user-config.service'
import { BUNDLER_DEFAULTS } from '../constants/bundler-options-defaults.config'
import type { BundlerOptions } from '../models/bundler-options.model'

/**
 * Delete target directory
 * @param targetDir - target directory to clean
 */
export async function cleanTarget(targetDir: string) {
    try {
        await rm(targetDir, { recursive: true, force: true })
    } catch (error) {
        console.error(error)
    }
}

/**
 * Copy assets to the target directory
 * @param assetsDir - target dir to copy assets to
 * @param assets - array of assets to copy, in glob format
 */
export async function copyAssets(assetsDir: string, assets: string[]) {
    try {
        await mkdir(assetsDir, { recursive: true })

        const matches = globSync(assets)

        const copiesPrm = matches.map((filePath) => {
            const fileName = basename(filePath)
            return copyFile(filePath, `${assetsDir}/${fileName}`)
        })
        await Promise.all(copiesPrm)
    } catch (error) {
        console.error(`Error copying assets: ${error.stack}`)
        throw error
    }
}

/**
 * Get options for the bundler, merged with the user config file
 */
export async function buildOptions(): Promise<Required<BundlerOptions>> {
    const { bundlerOptions } = await readConfigFile()

    const mergedObject = merge({}, BUNDLER_DEFAULTS, bundlerOptions ?? {})

    const targetDir = resolve(cwd(), mergedObject.targetDir)
    const assetsDir = resolve(targetDir, mergedObject.assetsDir)

    const res: Required<BundlerOptions> = {
        ...mergedObject,
        targetDir,
        assetsDir,
    }
    return res
}
