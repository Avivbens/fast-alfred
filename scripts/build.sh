# TypeScript build
tsc -p ./src/tsconfig.json
tsc-alias -p ./src/tsconfig.json

# Alloq bundler to be executable
chmod a+x ./lib/bundler/pack-workflow.esbuild.js

# Copy bundler assets
cp -r ./src/bundler/assets ./lib/bundler/assets
cp -r ./src/bundler/*.sh ./lib/bundler
