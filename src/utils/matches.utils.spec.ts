import { describe, expect, it, vi } from 'vitest'
import type { AlfredListItem } from '@models/alfred-list-item.model'
import { matches } from './matches.utils'

describe('matches', () => {
    const items: AlfredListItem[] = [
        { title: 'Fast Alfred' },
        { title: 'fast-alfred@client-additions' },
        { title: 'Other' },
    ]
    const byTitle = (item: AlfredListItem) => item.title

    it('should match case-insensitively by default', () => {
        const result = matches('FAST', items, byTitle)

        expect(result).toEqual([{ title: 'Fast Alfred' }, { title: 'fast-alfred@client-additions' }])
    })

    it('should respect caseSensitive', () => {
        const result = matches('fast', items, byTitle, { caseSensitive: true })

        expect(result).toEqual([{ title: 'fast-alfred@client-additions' }])
    })

    it('should compare plain strings directly, without calling compareBy', () => {
        const compareBy = vi.fn()

        const result = matches('al', ['alpha', 'beta', 'Gamma Alpha'], compareBy)

        expect(result).toEqual(['alpha', 'Gamma Alpha'])
        expect(compareBy).not.toHaveBeenCalled()
    })

    it('should match composed and decomposed unicode forms', () => {
        const composed = 'café'
        const decomposed = 'café'

        const result = matches(composed, [{ title: `${decomposed} bar` }], byTitle)

        expect(result).toEqual([{ title: `${decomposed} bar` }])
    })

    it('should return every item for an empty input, so an empty filter shows the whole list', () => {
        const result = matches('', items, byTitle)

        expect(result).toEqual(items)
    })
})
