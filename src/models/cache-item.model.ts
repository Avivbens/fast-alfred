export interface CacheItem<T = unknown> {
    timestamp: string
    version: string
    data: T
}
