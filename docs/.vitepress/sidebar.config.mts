import { DefaultTheme } from 'vitepress'

export const SIDEBAR: DefaultTheme.Sidebar = [
    {
        text: 'Setup',
        base: '/app/setup/',
        link: '../quick-start',
        collapsed: false,
        items: [
            {
                text: 'Bundler Options',
                link: 'bundler-options',
            },
        ],
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
        ],
    },
]
