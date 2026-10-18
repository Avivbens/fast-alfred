module.exports = {
    '*.{ts,cjs,js,json}': 'eslint --cache --fix',
    '**/*': 'prettier --cache --write --ignore-unknown',
}
