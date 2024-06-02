import { resolve } from 'node:path'
import type { BundlerOptions } from '../models/bundler-options.model'

export const BUNDLER_DEFAULTS: Required<BundlerOptions> = {
    assets: [],
    assetsDir: 'assets',
    targetDir: 'esbuild',
    productionScripts: ['src/main/*.ts'],
    includeBanners: true,
    minify: true,
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

/**
 * Fix common issues when compiling both `esm` and `cjs` modules.
 */
export const DEFAULT_BANNERS = {
    js: `
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import _private_path from 'node:path';
import _private_url from 'node:url';

globalThis.require = createRequire(import.meta.url);
globalThis.__filename = _private_url.fileURLToPath(import.meta.url);
globalThis.__dirname = _private_path.dirname(__filename);
`,
} as const
