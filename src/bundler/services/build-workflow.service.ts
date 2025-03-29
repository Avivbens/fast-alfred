import * as esbuild from 'esbuild'
import { basename, resolve } from 'node:path'
import { execPromise } from '@common/utils'
import { readWorkflowPackageJson } from '@common/workflow-package-json.service'
import {
    ALL_FRAMEWORK_ASSETS,
    ESM_HELPERS,
    GLOBAL_BANNER,
    PACK_ENTITIES,
    SAFE_ROOT_ASSETS,
    WORKFLOW_METADATA_FILES,
} from '../constants/bundler-options-defaults.config'
import { buildOptions, cleanTarget, copyAssets } from '../utils/bundler.utils'

export async function buildWorkflow() {
    const options = await buildOptions()
    const {
        assets,
        assetsDir,
        esmHelpers,
        minify,
        outputFormat,
        overrideEsbuildOptions,
        productionScripts,
        targetDir,
        treeShaking,
    } = options

    const ALL_ASSETS = [...assets, ...ALL_FRAMEWORK_ASSETS]

    await cleanTarget(targetDir)

    const jsBanners: string[] = [GLOBAL_BANNER]
    esmHelpers && jsBanners.push(ESM_HELPERS)

    const banners = {
        js: jsBanners.join('\n'),
    }

    await esbuild.build({
        platform: 'node',
        entryPoints: productionScripts,
        outdir: targetDir,
        bundle: true,
        treeShaking,
        minify,
        format: outputFormat,
        banner: banners,
        ...overrideEsbuildOptions,
    })

    await copyAssets(assetsDir, ALL_ASSETS)
}

export async function packWorkflow() {
    const { name } = await readWorkflowPackageJson()
    const { targetDir, rootAssets } = await buildOptions()

    const targetDirName = basename(targetDir)
    const targetDirParent = resolve(targetDir, '..')

    if (!name || !targetDir) {
        throw new Error('Missing workflow name or targetDir!')
    }

    /**
     * Create the workflow file
     */
    const archivePath = `${targetDir}/${name}.alfredworkflow`
    const createCommandOptions = PACK_ENTITIES(WORKFLOW_METADATA_FILES, true)
    const createZipCommand = `zip -9 -r "${archivePath}" ${createCommandOptions.join(' ')}`
    await execPromise(createZipCommand)

    /**
     * Add root assets to the workflow file
     */
    if (rootAssets.length) {
        const addRootAssetsCommandOptions = PACK_ENTITIES(SAFE_ROOT_ASSETS(rootAssets), false)
        const addRootAssetsCommand = `zip -9 -r "${archivePath}" ${addRootAssetsCommandOptions.join(' ')}`
        await execPromise(addRootAssetsCommand)
    }

    /**
     * Add the compiled files to the workflow file
     */
    const addBuildCommandOptions = PACK_ENTITIES([`${targetDirName}/**`], false)
    const addBuildCommand = `cd ${targetDirParent} && zip -9 -r "${archivePath}" ${addBuildCommandOptions.join(' ')}`
    await execPromise(addBuildCommand)
}
