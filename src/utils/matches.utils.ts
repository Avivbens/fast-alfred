import type { AlfredListItem } from '@models/alfred-list-item.model'

/**
 * @description
 * Search for a query in a list of items
 *
 * @param input - Query to search for
 * @param list - List of items to search in
 * @param compareBy - Function to get the compared value from the item
 * @param options - Whether the search should be case sensitive or not, default is false
 */
export function matches<K = AlfredListItem>(
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
