---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
    name: 'Fast Alfred'
    tagline: 'Your Alfred friendly framework, for developing Alfred workflows in TypeScript/JavaScript.'
    # image:
    #     src: /logos/logo-full-no-bg.png
    #     alt: shell-config logo
    actions:
        - theme: brand
          text: Quick Start
          link: /app/quick-start
        - theme: alt
          text: Troubleshooting
          link: /app/troubleshooting/index
features:
    - title: Bundle Management
      # link: '/app/commands/assets'
      details: Automatically bundle your workflow into a `.alfredworkflow` file.
      icon: '👨‍💻'
    - title: Workflow Management
      # link: '/app/commands/assets'
      details: Automatically generate Alfred workflow metadata.
      icon: '🔨'
    - title: Version Management
      # link: '/app/commands/assets'
      details: Automatically manage your workflow version, both in `package.json` and `info.plist`.
      icon: '💯'
---
