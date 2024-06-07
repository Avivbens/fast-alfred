import AlfredConfigService from 'alfred-config'
import Conf from 'conf'
import { argv } from 'node:process'
import type { AlfredListItem } from '@models/alfred-list-item.model'
import type { AlfredScriptFilter } from '@models/alfred-script-filter.model'
import { ERROR_MESSAGE } from './client.config'
import { AlfredInfoService } from './services/alfred-info.service'
import { CacheConfigService } from './services/cache-config.service'
import { EnvService } from './services/env.service'
import { IconService } from './services/icon.service'

export class FastAlfred {
    /**
     * @description
     * Service to get Alfred's environment variables
     *
     * You can find all Alfred & Workflow metadata in here
     */
    public readonly alfredInfo: AlfredInfoService = new AlfredInfoService()
    public readonly userConfig: AlfredConfigService = new AlfredConfigService({})

    /**
     * @description
     * Get icons from the system
     *
     * You can use it to get the icon path for a specific icon
     *
     * @example
     * ```typescript
     *  alfredClient.output({
     *   items: [
     *       {
     *           title: 'Some Error',
     *           icon: {
     *               path: alfredClient.icons.getIcon('error'),
     *           },
     *       },
     *   ],
     *  })
     * ```
     */
    public readonly icons: IconService = new IconService()

    /**
     * @description
     * Get and set dedicated configuration for the Workflow
     *
     * You can use it to store and retrieve data saved about the user
     */
    public readonly config: Conf = new Conf({})

    /**
     * @description
     * Get Environment variables
     *
     * All Workflow user configuration would be injected in here
     */
    public readonly env = new EnvService()

    /**
     * @description
     * Get and set dedicated cache for your Workflow
     *
     * You can leverage it to optimize your Workflow performance
     *
     * @note
     * Use the `setWithTTL` in order to set a cache with a time to live
     */
    public readonly cache: CacheConfigService = new CacheConfigService({
        configName: 'FastAlfred',
        version: this.alfredInfo.alfredVersion() ?? '',
    })

    /**
     * @description
     * Get the input passed into the script filter (by `$1` or `{query}`)
     *
     * @note
     * If you're passing multiple inputs, you can use the `inputs` property
     */
    public readonly input: string = argv[2]

    /**
     * @description
     * Get all the inputs passed into the script filter
     *
     * @note
     * If you're passing only one input, you can use the `input` property
     */
    public readonly inputs: string[] = argv.slice(2)

    /**
     * @description
     * Outputs the script filter object to interacts with Alfred
     */
    public output(scriptFilterOutput: AlfredScriptFilter) {
        const output = JSON.stringify(scriptFilterOutput, null, '\t')
        console.log(output)
    }

    /**
     * @description
     * Log errors for debugging purposes
     */
    public log(text: string) {
        console.error(text)
    }

    /**
     * @description
     * Search for a query in a list of items
     *
     * @param input - Query to search for
     * @param list - List of items to search in
     * @param compareBy - Function to get the compared value from the item
     * @param options - Whether the search should be case sensitive or not, default is false
     */
    public matches<K = AlfredListItem>(
        input: string,
        list: K[],
        compareBy: (item: K, searchTerm: string) => string,
        options: { caseSensitive: boolean } = { caseSensitive: false },
    ): K[] {
        const { caseSensitive } = options
        const normal = (str: string) => (caseSensitive ? str.normalize() : str.toLowerCase().normalize())

        const filtered = list.filter((listItem) => {
            const targetedTerm = typeof listItem === 'string' ? listItem : compareBy(listItem, input)

            return normal(targetedTerm).includes(normal(input))
        })

        return filtered
    }

    /**
     * @description
     * Search for a query in the workflow input
     *
     * @param list - List of items to search in
     * @param compareBy - Function to get the compared value from the item
     * @param options - Whether the search should be case sensitive or not, default is false
     */
    public inputMatches<K = any>(
        list: K[],
        item: (item: K, searchTerm: string) => string,
        options?: { caseSensitive: boolean },
    ) {
        return this.matches(this.input, list, item, options)
    }

    /**
     * @description
     * Show an error message in Alfred UI
     *
     * @param error - Error object to display
     */
    public error(error: Error) {
        const errorMessage = ERROR_MESSAGE({
            error,
            workflowName: this.alfredInfo.workflowName(),
            alfredVersion: this.alfredInfo.alfredVersion(),
            workflowVersion: this.alfredInfo.workflowVersion(),
        })

        this.output({
            items: [
                {
                    title: error.stack ? `${error.name}: ${error.message}` : error.toString(),
                    subtitle: 'Press ⌘L to see the full error and ⌘C to copy it.',
                    valid: false,
                    text: {
                        copy: errorMessage,
                        largetype: error.toString(),
                    },
                    icon: {
                        path: this.icons.getIcon('error'),
                    },
                },
            ],
        })
    }
}
