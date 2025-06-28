export interface WorkflowMetadata {
    description: string
    category: Category
    connections: { [key: string]: Connection[] }
    version: string
    userconfigurationconfig: UserConfigurationConfig[]
    readme: string
    bundleid: string
    disabled: boolean
    objects: WorkflowObject[]
    createdby: string
    uidata: { [key: string]: Uidatum }
    name: string
    webaddress: string
}

export type Category = 'Tools' | 'Internet' | 'Productivity' | 'Uncategorised'

export interface Connection {
    destinationuid: string
    modifiers: number
    modifiersubtext: string
    vitoclose: boolean
    sourceoutputuid?: string
}

export interface WorkflowObject {
    config: ObjectConfig
    uid: string
    type: string
    version: number
}

export interface ObjectConfig {
    script?: string
    escaping?: number
    scriptfile?: string
    scriptargtype?: number
    type?: number
    concurrently?: boolean
    argumenttrimmode?: number
    keyword?: string
    queuedelayimmediatelyinitially?: boolean
    queuedelaymode?: number
    argumenttreatemptyqueryasnil?: boolean
    argumenttype?: number
    queuemode?: number
    alfredfiltersresultsmatchmode?: number
    runningsubtext?: string
    title?: string
    subtext?: string
    alfredfiltersresults?: boolean
    queuedelaycustom?: number
    withspace?: boolean
    text?: string
    conditions?: Condition[]
    elselabel?: string
    hideelse?: boolean
}

export interface Condition {
    inputstring: string
    matchcasesensitive: boolean
    matchmode: number
    matchstring: string
    outputlabel: string
    uid: string
}

export interface Uidatum {
    xpos: number
    ypos: number
    note?: string
}

export interface UserConfigurationConfig {
    label: string
    config: UserconfigurationconfigConfig
    description: string
    type: string
    variable: string
}

export interface UserconfigurationconfigConfig {
    trim?: boolean
    default?: string
    placeholder?: string
    required?: boolean
    minvalue?: number
    onlystoponmarkers?: boolean
    maxvalue?: number
    markercount?: number
    defaultvalue?: number
    showmarkers?: boolean
}
