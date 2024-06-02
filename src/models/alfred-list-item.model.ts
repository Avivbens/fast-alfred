interface ModPayload {
    arg: string
    subtitle: string
    valid?: boolean
}

const AVAILABLE_MODES = ['cmd', 'alt', 'ctrl', 'fn']
type AvailableModes = (typeof AVAILABLE_MODES)[number]
type AvailableModesCombination = `${AvailableModes}+${AvailableModes}` | AvailableModes

type Mods = Partial<Record<AvailableModesCombination, ModPayload>>

export interface AlfredListItem {
    title: string
    subtitle?: string
    arg?: string
    icon?: {
        type?: string
        path: string
    }
    mods?: Mods
    text?: {
        copy?: string
        largetype?: string
    }
    quicklookurl?: string
    type?: 'default' | 'file' | 'file:skipcheck' | 'file:skipcheck:skipicon'
    valid?: boolean
    match?: string
    autocomplete?: string
    uid?: string
    subtitle_mod?: {
        alt?: string
        cmd?: string
        ctrl?: string
        fn?: string
    }
    action?: any

    [key: string]: any
}
