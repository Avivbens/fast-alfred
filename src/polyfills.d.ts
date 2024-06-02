declare module 'alfred-config' {
    export default class AlfredConfigService {
        constructor(options: { cwd?: string })
        get<T = unknown>(key: string, defaultValue: T): T
        has(key: string): boolean
        get size(): number
    }
}
