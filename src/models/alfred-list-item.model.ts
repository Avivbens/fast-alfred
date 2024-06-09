interface ModPayload {
    arg: string
    subtitle: string
    valid?: boolean
}

const AVAILABLE_MODES = ['cmd', 'alt', 'ctrl', 'fn'] as const
type AvailableModes = (typeof AVAILABLE_MODES)[number]
type AvailableModesCombination = `${AvailableModes}+${AvailableModes}` | AvailableModes

type Mods = Partial<Record<AvailableModesCombination, ModPayload>>

/**
 * @see [Official Docs](https://www.alfredapp.com/help/workflows/inputs/script-filter/json/)
 */
export interface AlfredListItem {
    /**
     * @description
     * The title displayed in the result row. There are no options for this element and it is essential that this element is populated.
     */
    title: string

    /**
     * @description
     * The subtitle displayed in the result row.
     */
    subtitle?: string

    /**
     * @description
     * The argument which is passed through the workflow to the connected output action.
     *
     * @example
     * ```
     * "arg": "~/Desktop"
     *```
     *
     * While optional, it's highly recommended that you populate arg as it's the string which is passed to your connected output actions.
     * If excluded, you won't know which result item the user has selected.
     *
     * It is also possible to pass multiple arguments via an array of strings:
     *
     * @example
     * ```
     * "arg": ["~/Desktop", "~/Pictures"]
     * ```
     */
    arg?: string

    /**
     * @description
     * The icon displayed in the result row. path is relative to the workflow's root folder:
     *
     * @example
     * ```
     * "icon": {
     *     "path": "./custom_icon.png"
     * }
     * ```
     *
     *
     * The optional type key alters this behavior. Setting it to fileicon will tell Alfred to get the file icon for the specified path.
     *
     * @example
     * ```
     * "icon": {
     *     "type": "fileicon",
     *     "path": "~/Desktop"
     * }
     * ```
     *
     * filetype is similar but takes a file `UTI` (Uniform Type Identifier) as the path.
     *
     * @example
     * ```
     * "icon": {
     *     "type": "filetype",
     *     "path": "com.apple.rtfd"
     * }
     *```
     */
    icon?: {
        type?: string
        path: string
    }

    /**
     * @description
     * The mod element gives you control over how the modifier keys react.
     * It can alter the looks of a result (e.g. `subtitle`, `icon`) and output a different arg or session variables.
     */
    mods?: Mods

    /**
     * @description
     * Defines the text the user will get when copying the selected result row with `⌘C` or displaying large type with `⌘L`.
     *
     * If these are not defined, you will inherit Alfred's standard behaviour where the arg is copied to the Clipboard or used for Large Type.
     */
    text?: {
        copy?: string
        largetype?: string
    }

    /**
     * @description
     * A Quick Look URL which will be visible if the user uses the Quick Look feature within Alfred (tapping shift, or ⌘Y).
     * `quicklookurl` will also accept a file path, both absolute and relative to home using ~/.
     *
     * If absent, Alfred will attempt to use `arg` as the quicklook URL.
     */
    quicklookurl?: string

    /**
     * @description
     * By specifying `"type": "file"`, Alfred treats your result as a file on your system.
     * This allows the user to perform actions on the file like they can with Alfred's standard file filters.
     *
     * When returning files, Alfred will check if they exist before presenting that result to the user.
     * This has a very small performance implication but makes results as predictable as possible.
     * If you would like Alfred to skip this check because you are certain the files you are returning exist, use `"type": "file:skipcheck"`.
     *
     * @default
     * "default"
     */
    type?: 'default' | 'file' | 'file:skipcheck' | 'file:skipcheck:skipicon'

    /**
     * @description
     * If the item is valid or not.
     * If an item is valid then Alfred will action it when the user presses return.
     * If the item is not valid, Alfred will do nothing.
     * This allows you to intelligently prevent Alfred from actioning a result based on the current {query} passed into your script.
     *
     * @default true
     */
    valid?: boolean

    /**
     * @description
     * The match field enables you to define what Alfred matches against when the workflow is set to `"Alfred Filters Results"`.
     * If match is present, it fully replaces matching on the title property.
     *
     * The match field is always treated as case insensitive, and intelligently treated as diacritic insensitive.
     * If the search query contains a diacritic, the match becomes diacritic sensitive.
     */
    match?: string

    /**
     * @description
     * An optional but recommended string you can provide to populate into Alfred's search field if the user auto-complete's the selected result (⇥ by default).
     *
     * If the item is set to `"valid": false`, the auto-complete text is populated into Alfred's search field when the user actions the result.
     */
    autocomplete?: string

    /**
     * @description
     * A unique identifier for the item.
     * It allows Alfred to learn about the item for subsequent sorting and ordering of the user's actioned results.
     *
     * It is important that you use the same `UID` throughout subsequent executions of your script to take advantage of
     * Alfred's knowledge and sorting. To show results in the order you return them from your script, exclude the `UID` field or use `skipknowledge: true`.
     */
    uid?: string
    subtitle_mod?: {
        alt?: string
        cmd?: string
        ctrl?: string
        fn?: string
    }

    /**
     * @description
     * This element defines the Universal Action items used when actioning the result, and overrides the arg being used for actioning.
     * The action key can take a string or array for simple types, and the content type will automatically be derived by Alfred to `file`, `url`, or `text`.
     */
    action?: any

    [key: string]: any
}
