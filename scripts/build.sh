# TypeScript build
tsc -p ./src/tsconfig.json
tsc-alias -p ./src/tsconfig.json

# Permissions for execute bin
chmod a+x ./lib/bin/*

# Bundle client updates helpers
npx esbuild --bundle ./src/core/helpers/*.ts --outdir="./src/bundler/assets" --format="cjs" --platform="node" --target="node18"

# Copy bundler assets
cp -rf ./src/bundler/assets ./lib/bundler/assets
