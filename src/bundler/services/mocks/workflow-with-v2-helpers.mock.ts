import { workflowMock } from './workflow.mock'

const SCRIPT_FILTER_UID = 'CE84ED38-CD11-4B81-9E07-91C9D10EEE3C'
const CONDITIONAL_UID =
    '__fast-alfred_managed__v2_conditional_from_CE84ED38-CD11-4B81-9E07-91C9D10EEE3C_to_FD52D6DE-838E-4CEF-9D97-F47BAC0D8F71'
const CONDITION_UID =
    '__fast-alfred_managed__v2_condition_from_CE84ED38-CD11-4B81-9E07-91C9D10EEE3C_to_FD52D6DE-838E-4CEF-9D97-F47BAC0D8F71'

/**
 * {@link workflowMock} as written by `includeUpdatesHelpers` of the published fast-alfred 2.9.1,
 * before modifiers were part of the conditional uid. Plists committed with that release look like this.
 */
export const workflowWithV2HelpersMock = {
    ...workflowMock,
    connections: {
        ...workflowMock.connections,
        [SCRIPT_FILTER_UID]: [
            {
                destinationuid: CONDITIONAL_UID,
                modifiers: 0,
                modifiersubtext: '',
                vitoclose: true,
            },
        ],
        [CONDITIONAL_UID]: [
            {
                destinationuid: 'FD52D6DE-838E-4CEF-9D97-F47BAC0D8F71',
                modifiers: 0,
                modifiersubtext: '',
                vitoclose: true,
            },
            {
                destinationuid: '__fast-alfred_managed__v2_updater_workflow-update',
                modifiers: 0,
                modifiersubtext: '',
                sourceoutputuid: CONDITION_UID,
                vitoclose: false,
            },
            {
                destinationuid: '__fast-alfred_managed__v2_updater_snooze',
                modifiers: 0,
                modifiersubtext: '',
                sourceoutputuid: CONDITION_UID,
                vitoclose: false,
            },
        ],
    },
    objects: [
        ...workflowMock.objects,
        {
            config: {
                concurrently: false,
                escaping: 102,
                script: './esbuild/assets/run-node.sh esbuild/assets/workflow-update.js "$1"',
                scriptargtype: 1,
                scriptfile: '',
                type: 11,
            },
            type: 'alfred.workflow.action.script',
            uid: '__fast-alfred_managed__v2_updater_workflow-update',
            version: 2,
        },
        {
            config: {
                concurrently: false,
                escaping: 102,
                script: './esbuild/assets/run-node.sh esbuild/assets/snooze.js "$1"',
                scriptargtype: 1,
                scriptfile: '',
                type: 11,
            },
            type: 'alfred.workflow.action.script',
            uid: '__fast-alfred_managed__v2_updater_snooze',
            version: 2,
        },
        {
            config: {
                conditions: [
                    {
                        inputstring: '{query}',
                        matchcasesensitive: false,
                        matchmode: 4,
                        matchstring: '__fast-alfred_managed__',
                        outputlabel: 'Managed versions updates',
                        uid: CONDITION_UID,
                    },
                ],
                elselabel: 'Default Behavior',
                hideelse: false,
            },
            type: 'alfred.workflow.utility.conditional',
            uid: CONDITIONAL_UID,
            version: 1,
        },
    ],
    uidata: {
        ...workflowMock.uidata,
        '__fast-alfred_managed__v2_updater_workflow-update': {
            note: 'Workflow Update Helper',
            xpos: 1940,
            ypos: 0,
        },
        '__fast-alfred_managed__v2_updater_snooze': {
            note: 'Snooze Updates Helper',
            xpos: 1940,
            ypos: 220,
        },
        [CONDITIONAL_UID]: {
            note: 'Conditional Updates Helper',
            xpos: 315,
            ypos: 80,
        },
    },
}
