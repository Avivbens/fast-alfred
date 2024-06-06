import Conf from 'conf'
import type { CacheItem } from '@models/cache-item.model'

/**
 * @description
 * Get and set dedicated cache for your Workflow
 *
 * You can leverage it to optimize your Workflow performance
 *
 * @note
 * Use the `setWithTTL` in order to set a cache with a time to live
 */
export class CacheConfigService extends Conf {
    private readonly version: string
    constructor(options: { configName: string; cwd?: string; version: string }) {
        super(options)

        this.version = options.version
    }

    /**
     * @description
     * Get an item from cache
     *
     * @param key - The key to get
     * @param options - `ignoreMaxAge` to ignore the max age of the cache - return the data even if it's expired
     */
    public get<T = unknown>(key: string, options?: { ignoreMaxAge: boolean }): T | null {
        if (!options?.ignoreMaxAge && this.isExpired(key)) {
            super.delete(key)
            return null
        }

        const item = super.get(key) as CacheItem<T>
        return item && item.data
    }

    /**
     * @description
     * Set a cache with a time to live
     *
     * @param key - The key to set
     * @param value - The value to set
     * @param options - `maxAge` in milliseconds
     */
    public setWithTTL<T = unknown>(key: string, value: T, options?: { maxAge: number }): void {
        super.set(key, {
            timestamp: typeof options?.maxAge === 'number' ? Date.now() + options.maxAge : undefined,
            version: this.version,
            data: value,
        })
    }

    /**
     * @description
     * Check if a key exists and is not expired
     *
     * @param key - The key to check
     * @returns - `true` if the key exists and is not expired, `false` otherwise
     */
    public has(key: string): boolean {
        if (!super.has(key)) {
            return false
        }

        if (this.isExpired(key)) {
            super.delete(key)
            return false
        }

        return true
    }

    /**
     * @description
     * Check if a key is expired
     *
     * @param key - The key to check
     * @returns - `true` if the key is expired, `false` otherwise
     */
    public isExpired(key: string): boolean {
        const item = super.get(key) as CacheItem | undefined

        if (!item) {
            return false
        }

        const invalidTimestamp = item.timestamp && new Date(item.timestamp).getTime() < Date.now()
        const invalidVersion = item.version !== this.version

        return Boolean(invalidTimestamp || invalidVersion)
    }
}
