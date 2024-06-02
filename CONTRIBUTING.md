# Contributing to

Thank you for your interest in contributing to ``! We welcome contributions from everyone.

## Getting Started

To get started, follow these steps:

1. Install dependencies with `npm ci`
1. Make changes
1. Test your changes
1. Add tests if needed
1. Submit a pull request against the `master` branch
1. Ask for a review

### Consistent Development Environment :ninja:

You can use the following command, in order to trigger build for each save :sparkles:

```bash
find ./src -type f -name "*.ts" -o -name "*.sh" | entr -s "npm run build"
```

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. Make sure your commit messages follow the format below:

```git
<type>(optional scope): <description>
```

Available types:

1. `chore` - changes that should not affect production user code, e.g. update dev-dependencies
1. `fix` - bug fixes, e.g. fix linting errors
1. `feat` - new features, e.g. add new command
1. `docs` - changes to documentation
1. `ci` - changes to CI configuration
1. For breaking changes, add a `BREAKING CHANGE` section to the commit message body:

```git
feat: <description>

BREAKING CHANGE: <description>
```

## Contact

If you have any questions or concerns, please contact us at avivbens87@gmail.com

Happy contributing!
