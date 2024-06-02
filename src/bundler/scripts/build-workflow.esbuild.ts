#!/usr/bin/env node
import * as esbuild from 'esbuild'
import { ALL_FRAMEWORK_ASSETS, DEFAULT_BANNERS } from '../constants/bundler-defaults.config'
import { buildOptions, cleanTarget, copyAssets } from '../utils/bundler.utils'

;(async () => {
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
})()
