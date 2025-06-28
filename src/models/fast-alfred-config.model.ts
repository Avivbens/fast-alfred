import type { BundlerOptions } from '@bundler/models'
import type { UpdatesConfig } from './updates-config.model'
import type { WorkflowMetadata } from './workflow-metadata.model'

export interface FastAlfredConfig {
    bundlerOptions?: BundlerOptions
    workflowMetadata?: Pick<
        WorkflowMetadata,
        'readme' | 'createdby' | 'name' | 'category' | 'description' | 'webaddress'
    >

    /**
     * @description
     * Build-time configuration for automated updates feature.
     */
    updates?: UpdatesConfig

    /**
     * @description
     * The number of spaces to use for indentation.
     *
     * @default 2
     */
    tabSize?: number
}
