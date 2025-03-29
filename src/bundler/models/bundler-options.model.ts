import type { BuildOptions } from 'esbuild'

export interface BundlerOptions {
    /**
     * @description
     * Additional assets to be included in the bundle.
     * Would be located in the `assets` directory.
     *
     * @note
     * By default, it includes the `run-node.sh` file - in order to call the compiled file (do not use `node` command directly).
     */
    assets?: string[]

    /**
     * @description
     * Additional assets to be included in the root of the bundle.
     * Would be located on the workflow root directory.
     */
    rootAssets?: string[]

    /**
     * @description
     * The directory where the assets would be copied to.
     *
     * @default 'assets'
     */
    assetsDir?: string

    /**
     * @description
     * The directory where the compiled files would be placed.
     *
     * @default 'esbuild'
     */
    targetDir?: string

    /**
     * @description
     * Files to compile into single productions files.
     * These files would be the ones that you are calling via Alfred.
     *
     * @default ['src/main/*.ts']
     */
    productionScripts?: string[]

    /**
     * @description
     * Whether to include JS code in the bundle, that resolve common issues when compiling both `esm` and `cjs` modules.
     * Most issues would be resolving `require`, `__dirname` and `__filename` variables.
     *
     * @default false
     */
    esmHelpers?: boolean

    /**
     * @description
     * Whether to minify the output.
     * Should reduce file size, but prevent proper debugging.
     *
     * @note
     * According to [Alfred's documentation](https://alfred.app/security-and-privacy/#signed-binaries), this option is not recommended.
     *
     * @default false
     */
    minify?: boolean

    /**
     * @description
     * Whether to remove unused code from the output.
     *
     * @default true
     */
    treeShaking?: boolean

    /**
     * @description
     * The output format of the bundle.
     *
     * @default 'cjs'
     */
    outputFormat?: BuildOptions['format']

    /**
     * @description
     * In case you need to override the esbuild options.
     *
     * @default {}
     */
    overrideEsbuildOptions?: BuildOptions
}
