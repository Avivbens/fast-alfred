<div align="center">

# Build Amazing Alfred Workflows! :ninja:

**`fast-alfred` - Your Alfred friendly framework**, for developing Alfred workflows in TypeScript/JavaScript.

<br>

[![npm](https://img.shields.io/npm/v/fast-alfred)](https://www.npmjs.com/package/fast-alfred)
[![npm](https://img.shields.io/npm/dt/fast-alfred)](https://www.npmjs.com/package/fast-alfred)
![GitHub](https://img.shields.io/github/license/avivbens/fast-alfred)
[![GitHub Stars](https://img.shields.io/github/stars/avivbens/fast-alfred)](https://github.com/avivbens/fast-alfred/stargazers)

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/kcao7snkgx)

### <a href="https://avivbens.github.io/fast-alfred/" target="_blank">Read Our Official Docs 📚</a>

</div>

## Installation

```bash
npm install fast-alfred
```

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
