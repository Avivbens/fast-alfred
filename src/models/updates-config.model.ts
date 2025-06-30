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
     * Add user configuration options to the workflow.
     */
    userConfiguration?: {
        /**
         * @description
         * A user configuration checkbox to allow the user to enable or disable updates checks.
         *
         * @default false
         */
        checkUpdatesCheckbox?: boolean
    }

    /**
     * @description
     * A list of script names to exclude from getting the updates helpers.
     *
     * @default []
     */
    exclude?: string[]
}
