import type { BundlerOptions } from '@bundler/models'
import type { WorkflowMetadata } from './workflow-metadata.model'

export interface FastAlfredConfig {
    bundlerOptions?: BundlerOptions
    workflowMetadata?: Pick<
        WorkflowMetadata,
        'readme' | 'createdby' | 'name' | 'category' | 'description' | 'webaddress'
    >

    /**
     * @description
     * The number of spaces to use for indentation.
     *
     * @default 2
     */
    tabSize?: number
}
