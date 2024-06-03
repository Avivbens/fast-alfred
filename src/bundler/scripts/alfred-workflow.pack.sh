# Exit immediately if a command exits with a non-zero status
set -e

WORKFLOW_NAME=$(jq -r '.name' package.json)

# Extract the targetDir from the .fast-alfred.config.cjs file, if it exists
CONFIG_FILE="$PWD/.fast-alfred.config.cjs"
WORKFLOW_BUILD_DIR=$(node -e "try { console.log(require('$CONFIG_FILE')?.bundlerOptions?.targetDir || '') } catch (error) { console.log('') }")
if [ -z "$WORKFLOW_BUILD_DIR" ]; then
    WORKFLOW_BUILD_DIR="esbuild"
fi

# pack to Alfred Workflow
zip -9 -r "$WORKFLOW_BUILD_DIR/$WORKFLOW_NAME.alfredworkflow" *.png *.plist README.md esbuild/** package.json
