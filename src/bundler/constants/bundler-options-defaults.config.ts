import { resolve } from 'node:path'
import { PACKAGE_HOME } from '@common/constants'
import type { BundlerOptions } from '../models/bundler-options.model'

export const BUNDLER_DEFAULTS: Required<BundlerOptions> = {
    assets: [],
    rootAssets: [],
    assetsDir: 'assets',
    targetDir: 'esbuild',
    productionScripts: ['src/main/*.ts'],
    esmHelpers: false,
    minify: false,
    treeShaking: true,
    outputFormat: 'cjs',
    overrideEsbuildOptions: {},
}

export const ALL_FRAMEWORK_ASSETS = [
    /**
     * FastAlfred run-time
     */
    resolve(__dirname, `../assets/run-node.sh`),
]

export const GLOBAL_BANNER = `/**
* Bundled by FastAlfred
*
* @see [FastAlfred](${PACKAGE_HOME})
*/
` as const

/**
 * @description
 * This code would be included in the bundle, in order to resolve common issues when compiling both `esm` and `cjs` modules.
 */
export const ESM_HELPERS = `/**
 * Managed by FastAlfred bundler - do not modify
 * The following code is used to resolve common issues when compiling both 'esm' and 'cjs' modules.
 *
 * @see [FastAlfred](https://avivbens.github.io/fast-alfred/app/setup/bundler-options#esmhelpers)
 */

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import _private_path from 'node:path';
import _private_url from 'node:url';

globalThis.require = createRequire(import.meta.url);
globalThis.__filename = _private_url.fileURLToPath(import.meta.url);
globalThis.__dirname = _private_path.dirname(__filename);

/**
 * End of FastAlfred bundler helpers
 */
` as const

export const WORKFLOW_METADATA_FILES = ['*.png ', '*.plist', 'README.md', 'package.json']
export const SAFE_ROOT_ASSETS = (rootAssets: string[]) => rootAssets.map((path) => `"${path}"`)
export const PACK_ENTITIES = (files: string[], flatDirectories: boolean) => {
    const res = [...files]
    flatDirectories && res.unshift(`-j`)
    return res
}
