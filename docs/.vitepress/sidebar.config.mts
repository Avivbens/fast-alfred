import { DefaultTheme } from 'vitepress'

export const SIDEBAR: DefaultTheme.Sidebar = [
    {
        text: 'Setup',
        base: '/app/setup/',
        link: '../quick-start',
        collapsed: false,
        items: [
            {
                text: 'Node.js Runtime 🚀',
                link: 'runtime-explain',
            },
            {
                text: 'Bundler Options 🏗️',
                link: 'bundler-options',
            },
            {
                text: 'Workflow Metadata 🥷',
                link: 'workflow-metadata',
            },
            {
                text: 'Versioning 🔄',
                link: 'versioning',
            },
        ],
    },
    {
        text: 'CI / CD 🐙',
        base: '/app/ci/',
        collapsed: false,
        items: [
            {
                text: 'GitHub Actions 🤖',
                link: 'github-actions',
            },
            {
                text: 'Semantic Release 🚀',
                link: 'semantic-release',
            },
        ],
    },
    {
        text: 'Client',
        base: '/app/client/',
        link: 'client',
    },
    {
        text: 'Troubleshooting',
        base: '/app/troubleshooting/',
        link: 'index',
        collapsed: false,
        items: [
            {
                text: 'Missing Config File',
                link: 'missing-config-file',
            },
            {
                text: 'Empty Glob',
                link: 'empty-glob',
            },
            {
                text: 'No Target Version 🎯',
                link: 'no-target-version',
            },
        ],
    },
]
