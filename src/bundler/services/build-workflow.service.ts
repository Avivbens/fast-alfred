import * as esbuild from 'esbuild'
import { execPromise } from '@common/utils'
import { readWorkflowPackageJson } from '@common/workflow-package-json.service'
import { ALL_FRAMEWORK_ASSETS, DEFAULT_BANNERS, PACK_ENTITIES } from '../constants/bundler-options-defaults.config'
import { buildOptions, cleanTarget, copyAssets } from '../utils/bundler.utils'

export async function buildWorkflow() {
    const options = await buildOptions()
    const {
        assets,
        assetsDir,
        includeBanners,
        minify,
        outputFormat,
        overrideEsbuildOptions,
        productionScripts,
        targetDir,
        treeShaking,
    } = options

    const ALL_ASSETS = [...assets, ...ALL_FRAMEWORK_ASSETS]

    await cleanTarget(targetDir)

    await esbuild.build({
        platform: 'node',
        entryPoints: productionScripts,
        outdir: targetDir,
        bundle: true,
        treeShaking,
        minify,
        format: outputFormat,
        banner: includeBanners ? DEFAULT_BANNERS : undefined,
        ...overrideEsbuildOptions,
    })

    await copyAssets(assetsDir, ALL_ASSETS)
}

export async function packWorkflow() {
    const { name } = await readWorkflowPackageJson()
    const { targetDir } = await buildOptions()

    if (!name || !targetDir) {
        throw new Error('Missing workflow name or targetDir!')
    }

    const zipCommand = `zip -9 -r "${targetDir}/${name}.alfredworkflow" ${PACK_ENTITIES.join(' ')}`
    await execPromise(zipCommand)
}