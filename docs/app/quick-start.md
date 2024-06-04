---
prev: false
next:
    text: 'Node.js Runtime 🚀'
    link: '/app/setup/runtime-explain'
---

# Quick Start

## Installation

```bash
npm install fast-alfred
```

### Configuration

Create a `.fast-alfred.config.cjs` file in the root of your project and add the following configuration:

```javascript
/**
 * @type {import('fast-alfred').FastAlfredConfig}
 */
module.exports = {}
```

### Build Your First Workflow

1. Create a Workflow via Alfred UI, or use an existing one
1. Open the Workflow directory, copy relevant files
1. Create a new directory for your Workflow
 <!-- TODO link -->
1. Use `fast-alfred` client utilities to manage your Workflow
1. Call your scripts using [`fast-alfred` runtime](./setup/runtime-explain)

<br>
<hr>

# The Reason

`fast-alfred` lets you think about the functionality, rather than the boilerplate.

It provides you with a convenient way to manage your workflow, apply proper versioning, and bundle it into a `.alfredworkflow` file.

## The Hard Time When Developing Alfred Workflows In Node.js

According to [Alfred's official community](https://www.alfredforum.com/topic/21366-nodejs-workflows-deployment/?do=findComment&comment=110924),
it is not a best-practice to include any external dependencies at installation time,
so all of your code and its dependencies should be included in the workflow file.

[Alfred Gallery](https://alfred.app/) requires you to upload a `.alfredworkflow` file, which is a zip archive containing all the necessary files for your workflow to run.

In order to accomplish this task, we need to bundle our code into a single file and include it in the workflow.

## The Solution

`fast-alfred` allows you to bundle your production code into a few scripts, and include them in the workflow.
All bundle options are configurable, via a `.fast-alfred.config.cjs` file at the root of your project.