---
prev: true
next: true
---

# Workflow Metadata :ninja:

`fast-alfred` configuration allows you ot modify & sync the `info.plist` file automatically

In order to change the values, change the configuration file `.fast-alfred.config.cjs` at the root of your project:

### Example

```javascript
const { author, description, homepage } = require('./package.json')

const README = `
PUT YOUR README IN HERE...

LINK TO REPO: ${homepage}
`.trim()

/**
 * @type {import('fast-alfred').FastAlfredConfig}
 */
module.exports = {
    workflowMetadata: {
        name: 'WORKFLOW NAME',
        category: '<category>',
        createdby: author.name,
        webaddress: homepage,
        description,
        readme: README,
    },
}
```
