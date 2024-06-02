# Description: Build Alfred workflow using fast-alfred

# Exit immediately if a command exits with a non-zero status
set -e

# Build using fast-alfred
./node_modules/fast-alfred/lib/bundler/scripts/build-workflow.esbuild.js

# Update workflow metadata version (info.plist)
NEXT_VERSION=$1
./node_modules/fast-alfred/lib/bundler/scripts/update-workflow-version.js $NEXT_VERSION

# Pack Alfred workflow
./node_modules/fast-alfred/lib/bundler/scripts/alfred-workflow.pack.sh
