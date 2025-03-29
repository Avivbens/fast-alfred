import { Command, CommandRunner, Option } from 'nest-commander'
import { exit } from 'node:process'
import ora, { Ora } from 'ora'
import { coerce, valid } from 'semver'
import { buildWorkflow, packWorkflow } from '@bundler/services/build-workflow.service'
import {
    updateWorkflowMetadataVersion,
    updateWorkflowPackageJsonVersion,
} from '@bundler/services/update-workflow-version.service'
import { InjectLogger, LoggerService } from '../../core/logger'
import { PackCommandOptions } from './models/pack-command-options.model'

@Command({
    name: 'pack',
    description: 'Build + Bundle your application for production. Creating a `alfredworkflow` file.',
    options: { isDefault: true },
})
export class PackCommand extends CommandRunner {
    constructor(@InjectLogger(PackCommand.name) private readonly logger: LoggerService) {
        super()
    }

    @Option({
        name: 'targetVersion',
        flags: '-t --target-version <targetVersion>',
        description: 'Amount of parallel processes for installation',
    })
    private targetVersion(version: string): string {
        const parsedVersion = coerce(version)
        const validatedVersion = valid(parsedVersion)

        if (!validatedVersion) {
            this.logger.error(`Invalid version - ${version}`)
            exit(1)
        }

        return validatedVersion
    }

    @Option({
        name: 'verbose',
        flags: '--verbose',
        defaultValue: false,
        description: 'Enable verbose mode',
    })
    private isVerbose(): boolean {
        return true
    }

    @Option({
        name: 'noPack',
        flags: '--no-pack',
        defaultValue: false,
        description: 'Only build the workflow without packing it.',
    })
    private noPack(): boolean {
        return true
    }

    @Option({
        name: 'noPackageJson',
        flags: '--no-package-json',
        defaultValue: false,
        description: 'Do not update the package.json & package-lock.json files.',
    })
    private noPackageJson(): boolean {
        return true
    }

    public async run(passedParams: string[], options?: PackCommandOptions): Promise<void> {
        const { targetVersion, verbose, noPack, noPackageJson } = options ?? {}

        if (verbose) {
            this.logger.setLogLevel('verbose')
        }

        /**
         * Backward compatibility with the deprecated way of passing the target version as a parameter
         * @deprecated
         */
        const [deprecatedTargetVersion] = passedParams
        if (deprecatedTargetVersion) {
            this.logger.warn(`Target version as a parameter is deprecated. Use --target-version instead.`)
        }

        const parsedTargetVersion = coerce(targetVersion || deprecatedTargetVersion)?.toString()

        this.logger.verbose(`Target version from options: ${targetVersion}`)
        this.logger.verbose(`Target version from deprecated params: ${deprecatedTargetVersion}`)

        if (!parsedTargetVersion) {
            this.logger.error('No target version provided')
            exit(1)
        }

        let spinner: Ora | null = ora({
            text: `Alfred Workflow pack - version: ${parsedTargetVersion}`,
            hideCursor: false,
            discardStdin: false,
        })

        spinner?.start()

        try {
            await this.buildWorkflow()
            await this.updateWorkflowVersion(parsedTargetVersion, noPackageJson)

            if (noPack) {
                return
            }

            await this.packWorkflow()
        } catch (error) {
            this.logger.error(`Failed to pack Alfred Workflow - ${error.message}`)
            spinner?.fail()

            spinner = null
        } finally {
            spinner?.succeed()
        }
    }

    private async updateWorkflowVersion(version: string, noPackageJson: boolean = false): Promise<void> {
        try {
            const prms = [
                updateWorkflowMetadataVersion(version),
                !noPackageJson && updateWorkflowPackageJsonVersion(version),
            ]
            await Promise.all(prms)
        } catch (error) {
            this.logger.verbose(`Failed to update Alfred Workflow version - ${error.stack}`)
            throw error
        }
    }

    private async buildWorkflow(): Promise<void> {
        try {
            await buildWorkflow()
        } catch (error) {
            this.logger.verbose(`Failed to build Alfred Workflow - ${error.stack}`)
            throw error
        }
    }

    private async packWorkflow(): Promise<void> {
        try {
            await packWorkflow()
        } catch (error) {
            this.logger.verbose(`Failed to pack Alfred Workflow - ${error.stack}`)
            throw error
        }
    }
}
