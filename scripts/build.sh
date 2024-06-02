# TypeScript build
tsc -p ./src/tsconfig.json
tsc-alias -p ./src/tsconfig.json

# Allow bundler to be executable
chmod a+x ./lib/bundler/scripts/*.js

# Copy bundler assets
cp -rf ./src/bundler/assets ./lib/bundler/assets
cp -rf ./src/bundler/scripts/*.sh ./lib/bundler/scripts
