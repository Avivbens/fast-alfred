export interface UpdatesConfig {
    /**
     * @description
     * To allow `fast-alfred` make updates checks interactive, you'll need to have some
     * additional code helpers in your workflow.
     *
     * @default false
     *
     * @experimental
     */
    bundleHelpers?: boolean

    /**
     * @description
     * A list of script names to exclude from getting the updates helpers.
     *
     * @default []
     */
    exclude?: string[]
}
