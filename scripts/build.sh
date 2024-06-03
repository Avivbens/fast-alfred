# TypeScript build
tsc -p ./src/tsconfig.json
tsc-alias -p ./src/tsconfig.json

# Permissions for execute bin
chmod a+x ./lib/bin/*

# Copy bundler assets
cp -rf ./src/bundler/assets ./lib/bundler/assets
