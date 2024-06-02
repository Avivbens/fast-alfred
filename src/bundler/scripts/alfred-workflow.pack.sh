# Exit immediately if a command exits with a non-zero status
set -e

WORKFLOW_NAME=$(jq -r '.name' package.json)

# pack to Alfred Workflow
zip -9 -r "esbuild/$WORKFLOW_NAME.alfredworkflow" *.png *.plist README.md esbuild/** package.json