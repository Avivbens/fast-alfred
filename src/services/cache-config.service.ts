import Conf from 'conf'
import type { CacheItem } from '@models/cache-item.model'

export class CacheConfigService extends Conf {
    private readonly version: string
    constructor(options: { configName: string; cwd?: string; version: string }) {
        super(options)

        this.version = options.version
    }

    public get<T = unknown>(key: string, options?: { ignoreMaxAge: boolean }): T | null {
        if (!options?.ignoreMaxAge && this.isExpired(key)) {
            super.delete(key)
            return null
        }

        const item = super.get(key) as CacheItem<T>
        return item && item.data
    }

    public setWithTTL<T = unknown>(key: string, value: T, options?: { maxAge: number }): void {
        super.set(key, {
            timestamp: typeof options?.maxAge === 'number' ? Date.now() + options.maxAge : undefined,
            version: this.version,
            data: value,
        })
    }

    has(key: string) {
        if (!super.has(key)) {
            return false
        }

        if (this.isExpired(key)) {
            super.delete(key)
            return false
        }

        return true
    }

    isExpired(key: string) {
        const item = super.get(key) as CacheItem | undefined

        if (!item) {
            return false
        }

        const invalidTimestamp = item.timestamp && new Date(item.timestamp).getTime() < Date.now()
        const invalidVersion = item.version !== this.version

        return Boolean(invalidTimestamp || invalidVersion)
    }
}
