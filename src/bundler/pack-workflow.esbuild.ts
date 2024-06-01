#!/usr/bin/env node
import * as esbuild from 'esbuild'
import { globSync } from 'glob'
import { copyFile, mkdir, rm } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { cwd } from 'node:process'

const TARGET_DIR = resolve(cwd(), 'esbuild')
const ASSETS_DIR = `${TARGET_DIR}/assets`

const ALL_ASSETS = [
    /**
     * FastAlfred run-time
     */
    resolve(__dirname, `./assets/run-node.sh`),
]

const cleanTarget = async () => {
    try {
        await rm(TARGET_DIR, { recursive: true, force: true })
    } catch (error) {
        console.error(error)
    }
}

const copyAssets = async (assets: string[]) => {
    try {
        await mkdir(ASSETS_DIR, { recursive: true })

        const matches = globSync(assets)

        const copiesPrm = matches.map((filePath) => {
            const fileName = basename(filePath)
            return copyFile(filePath, `${ASSETS_DIR}/${fileName}`)
        })
        await Promise.all(copiesPrm)
    } catch (error) {
        console.error(`Error copying assets: ${error.stack}`)
        throw error
    }
}

;(async () => {
    await cleanTarget()

    await esbuild.build({
        platform: 'node',
        entryPoints: ['src/*.ts'],
        bundle: true,
        outdir: TARGET_DIR,
        treeShaking: true,
        format: 'cjs',
        /**
         * Fix `Error: Dynamic require of "buffer" is not supported` error
         */
        banner: {
            js: `
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import _private_path from 'node:path';
import _private_url from 'node:url';

globalThis.require = createRequire(import.meta.url);
globalThis.__filename = _private_url.fileURLToPath(import.meta.url);
globalThis.__dirname = _private_path.dirname(__filename);
`,
        },
    })

    await copyAssets(ALL_ASSETS)
})()
