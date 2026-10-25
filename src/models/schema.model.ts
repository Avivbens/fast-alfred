/**
 * @description
 * Any schema with a `parse` method, e.g. a zod schema
 *
 * @note
 * Structural on purpose, so `fast-alfred` never imports a schema library and zod stays optional
 */
export interface Schema<T> {
    parse(input: unknown): T
}
