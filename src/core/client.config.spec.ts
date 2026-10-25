import { describe, expect, it } from 'vitest'
import { CHECK_UPDATES_SCHEMA } from './client.config'

describe('CHECK_UPDATES_SCHEMA', () => {
    it.each([
        { value: undefined, expected: true },
        { value: '1', expected: true },
        { value: '0', expected: false },
        { value: '', expected: false },
    ])('should parse $value as $expected, as the previous defaultValue and parser did', ({ value, expected }) => {
        expect(CHECK_UPDATES_SCHEMA.parse(value)).toBe(expected)
    })
})
