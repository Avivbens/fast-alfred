import { homedir } from 'node:os'
import { describe, expect, it } from 'vitest'
import { ZodError, z } from 'zod'
import { alfredSchemas } from './alfred.schemas'

describe('alfredSchemas', () => {
    describe('checkbox', () => {
        it.each([
            { value: '1', expected: true },
            { value: '0', expected: false },
        ])('should parse $value as $expected', ({ value, expected }) => {
            expect(alfredSchemas.checkbox().parse(value)).toBe(expected)
        })

        it('should apply a chained default when Alfred passes nothing', () => {
            expect(alfredSchemas.checkbox().default(true).parse(undefined)).toBe(true)
        })

        it('should reject a value that is not a checkbox', () => {
            expect(() => alfredSchemas.checkbox().parse('maybe')).toThrow(ZodError)
        })
    })

    describe('number', () => {
        it('should coerce a slider value', () => {
            expect(alfredSchemas.number().parse('15')).toBe(15)
        })

        it('should reject text', () => {
            expect(() => alfredSchemas.number().parse('abc')).toThrow(ZodError)
        })
    })

    describe('list', () => {
        it('should split on commas, trim the items and drop the blank ones', () => {
            expect(alfredSchemas.list().parse(' English, Hebrew ,, ')).toEqual(['English', 'Hebrew'])
        })

        it('should split on the given separator', () => {
            expect(alfredSchemas.list(';').parse('a; b;;c')).toEqual(['a', 'b', 'c'])
        })
    })

    describe('lines', () => {
        it('should trim the lines and drop the blank ones', () => {
            expect(alfredSchemas.lines().parse('  first \n\n \nsecond')).toEqual(['first', 'second'])
        })
    })

    describe('paths', () => {
        it('should expand a leading ~ only', () => {
            const result = alfredSchemas.paths().parse('~/dev\n\n/opt\n~\n~user/code\n/tmp/~/x')

            expect(result).toEqual([`${homedir()}/dev`, '/opt', homedir(), '~user/code', '/tmp/~/x'])
        })
    })

    describe('json', () => {
        const aliases = alfredSchemas.json(z.record(z.string(), z.string()))

        it('should parse and validate a JSON string', () => {
            expect(aliases.parse('{"g":"git"}')).toEqual({ g: 'git' })
        })

        it('should report invalid JSON as a ZodError', () => {
            expect(() => aliases.parse('{not json')).toThrow(/Invalid JSON/)
            expect(() => aliases.parse('{not json')).toThrow(ZodError)
        })

        it('should reject JSON that does not match the schema', () => {
            expect(() => aliases.parse('{"g":1}')).toThrow(ZodError)
        })
    })
})
