import * as esbuild from 'esbuild'
import { basename } from 'node:path'
import { execPromise } from '@common/utils'
import { readWorkflowPackageJson } from '@common/workflow-package-json.service'
import {
    ALL_FRAMEWORK_ASSETS,
    ESM_HELPERS,
    GLOBAL_BANNER,
    PACK_ENTITIES,
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
    const { targetDir } = await buildOptions()
    const targetDirName = basename(targetDir)

    if (!name || !targetDir) {
        throw new Error('Missing workflow name or targetDir!')
    }

    const zipCommand = `zip -9 -r "${targetDir}/${name}.alfredworkflow" ${PACK_ENTITIES(targetDirName).join(' ')}`
    await execPromise(zipCommand)
}
