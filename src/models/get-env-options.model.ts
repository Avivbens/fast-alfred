export interface GetEnvOptions<T = unknown> {
    defaultValue: T
    parser?: (value: string) => T
}
