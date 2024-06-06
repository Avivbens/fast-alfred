import { env } from 'node:process'

/**
 * @description
 * Service to get Alfred's environment variables
 *
 * You can find all Alfred & Workflow metadata in here
 */
export class AlfredInfoService {
    private getEnv(key: string): string | undefined {
        return env[`alfred_${key}`]
    }

    public alfredVersion(): string {
        return this.getEnv('version') as string
    }

    public workflowName(): string {
        return this.getEnv('workflow_name') as string
    }

    public workflowVersion(): string {
        return this.getEnv('workflow_version') as string
    }

    public theme(): string | undefined {
        return this.getEnv('theme')
    }

    public themeBackground(): string | undefined {
        return this.getEnv('theme_background')
    }

    public themeSelectionBackground(): string | undefined {
        return this.getEnv('theme_selection_background')
    }

    public themeSubtext(): number | undefined {
        return Number(this.getEnv('theme_subtext'))
    }

    public data(): string | undefined {
        return this.getEnv('workflow_data')
    }

    public cache(): string | undefined {
        return this.getEnv('workflow_cache')
    }

    public preferences(): string | undefined {
        return this.getEnv('preferences')
    }

    public preferencesLocalHash(): string | undefined {
        return this.getEnv('preferences_localhash')
    }

    public uid(): string | undefined {
        return this.getEnv('workflow_uid')
    }

    public bundleId(): string | undefined {
        return this.getEnv('workflow_bundleid')
    }
}
