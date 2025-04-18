## [2.3.1](https://github.com/Avivbens/fast-alfred/compare/v2.3.0...v2.3.1) (2025-04-18)


### Bug Fixes

* bump up `esbuild` to `v0.25` ([3567972](https://github.com/Avivbens/fast-alfred/commit/3567972b4b72febf4bf25f6ee8694b2e60362030))
* bump up deps to resolve vulnerabilities ([d4d6e2d](https://github.com/Avivbens/fast-alfred/commit/d4d6e2d8b592375531ad4bc8c4a994ed7d80cd89))
* run `npm audit fix` - 10 => 4 vulnerabilities ([4577db8](https://github.com/Avivbens/fast-alfred/commit/4577db88b88ff288632ab1b2baa9deaf35c616c5))

# [2.3.0](https://github.com/Avivbens/fast-alfred/compare/v2.2.0...v2.3.0) (2025-03-29)


### Bug Fixes

* split workflow packing into multiple steps, to allow gather build output from different locations - `fast-alfred` now supports monorepo 🥷 ([4a41f2e](https://github.com/Avivbens/fast-alfred/commit/4a41f2ec6ba5a2ccd7135a94e676540dc993a3dc))


### Features

* **cli:** support `--no-package-json` flag to aviod updating the `package.json` & `package-loc.json` files ([09f0d03](https://github.com/Avivbens/fast-alfred/commit/09f0d03d6d34e894f89777af81134c61d24d86fd))

# [2.2.0](https://github.com/Avivbens/fast-alfred/compare/v2.1.2...v2.2.0) (2024-08-15)


### Features

* support `rootAssets` option for bundler ([b998da3](https://github.com/Avivbens/fast-alfred/commit/b998da3f305fa637c2016ccf447559c2c77579f8))

## [2.1.2](https://github.com/Avivbens/fast-alfred/compare/v2.1.1...v2.1.2) (2024-06-14)


### Bug Fixes

* align `run-node` asset to use just Node.js alias, change docs image ([feae219](https://github.com/Avivbens/fast-alfred/commit/feae219cb1923ea65730b20d69f7be3b93660003))
* set `minify` to `false` by default - according to Alfred community guildlines 🚀 ([57e5007](https://github.com/Avivbens/fast-alfred/commit/57e5007d3bb48ce23f465e5d31e64b39740d1bc3))

## [2.1.1](https://github.com/Avivbens/fast-alfred/compare/v2.1.0...v2.1.1) (2024-06-09)


### Bug Fixes

* improve `AlfredScriptFilter` types and docs 🥷 ([a6cf3db](https://github.com/Avivbens/fast-alfred/commit/a6cf3dbc5af5c7fce2af7004478be78df1065284))

# [2.1.0](https://github.com/Avivbens/fast-alfred/compare/v2.0.1...v2.1.0) (2024-06-08)


### Features

* support more icons, allow non-specified icons ([69ff48a](https://github.com/Avivbens/fast-alfred/commit/69ff48ae07c08a6a7b81d78452e1b959aaeed1fa))

## [2.0.1](https://github.com/Avivbens/fast-alfred/compare/v2.0.0...v2.0.1) (2024-06-08)


### Bug Fixes

* add banners info, add global `fast-alfred` banner ([0f413ed](https://github.com/Avivbens/fast-alfred/commit/0f413edc3c962f4c2a3dfb12115cadba47d76351))

# [2.0.0](https://github.com/Avivbens/fast-alfred/compare/v1.3.4...v2.0.0) (2024-06-07)


### Bug Fixes

* allow both `cjs` and `esm` formats, by user configuration ([e9f45e9](https://github.com/Avivbens/fast-alfred/commit/e9f45e98ede3bbb862ee01b822cf1853a5f20559))


### BREAKING CHANGES

* `includeBanners` property under `bundlerOptions` is no longer available, please use `esmHelpers` instead
* `fast-alfred` by default supporting the `cjs` format, in case of `esm` - follow the official docs

## [1.3.4](https://github.com/Avivbens/fast-alfred/compare/v1.3.3...v1.3.4) (2024-06-07)


### Bug Fixes

* add `inputs` property to get multiple inputs ([4d3429a](https://github.com/Avivbens/fast-alfred/commit/4d3429af8f708619d7368be2dafc702512fc2686))

## [1.3.3](https://github.com/Avivbens/fast-alfred/compare/v1.3.2...v1.3.3) (2024-06-06)


### Bug Fixes

* **bundler:** pack issues when `targetDir` changed ([6e6e5e2](https://github.com/Avivbens/fast-alfred/commit/6e6e5e2d02f6a1c1702cd15c367a40fa3b4929aa))
* suppprt `isDebug` for `alfredInfo` ([f18740b](https://github.com/Avivbens/fast-alfred/commit/f18740b297a031976fe94c7872716ad2eee8d0cd))

## [1.3.2](https://github.com/Avivbens/fast-alfred/compare/v1.3.1...v1.3.2) (2024-06-06)


### Bug Fixes

* readme with details ([18f8e90](https://github.com/Avivbens/fast-alfred/commit/18f8e907227557b82872bf8ce7dcfe87f6ce8088))

## [1.3.1](https://github.com/Avivbens/fast-alfred/compare/v1.3.0...v1.3.1) (2024-06-06)


### Bug Fixes

* `icons` client types ([c021c5c](https://github.com/Avivbens/fast-alfred/commit/c021c5c5df719fdfda93f7a26ccbf3080fd86eb6))
* remove unused code, add types for `CacheService` ([ac44bf8](https://github.com/Avivbens/fast-alfred/commit/ac44bf8166920b77ed08f4397ec99a8b07d2da1d))

# [1.3.0](https://github.com/Avivbens/fast-alfred/compare/v1.2.1...v1.3.0) (2024-06-03)

### Features

-   support `fast-alfred` CLI 🚀 ([ac9811a](https://github.com/Avivbens/fast-alfred/commit/ac9811a3f947881e5d15c9e932f891cfa1f0de5e))

## [1.2.1](https://github.com/Avivbens/fast-alfred/compare/v1.2.0...v1.2.1) (2024-06-03)

### Bug Fixes

-   **configuration:** support `tabSize` option ([17b237b](https://github.com/Avivbens/fast-alfred/commit/17b237b15d968b4d9947e4a39d5c74492e85ef9e))

# [1.2.0](https://github.com/Avivbens/fast-alfred/compare/v1.1.3...v1.2.0) (2024-06-03)

### Features

-   **bundler:** support update `package.json` version too 🚀 ([46b4172](https://github.com/Avivbens/fast-alfred/commit/46b4172b2535d5ed7886f9328d18938edf9f8e6d))

## [1.1.3](https://github.com/Avivbens/fast-alfred/compare/v1.1.2...v1.1.3) (2024-06-03)

### Bug Fixes

-   `pack` script get `targetDir` from config file, if exists 🏗️ ([8353241](https://github.com/Avivbens/fast-alfred/commit/83532412dc36d0625234fca071f2a00d9b314799))

## [1.1.2](https://github.com/Avivbens/fast-alfred/compare/v1.1.1...v1.1.2) (2024-06-03)

### Bug Fixes

-   better error handling and logs for reading configuration file 📂 ([3efc192](https://github.com/Avivbens/fast-alfred/commit/3efc1924971a4acbe03527a4ba718353219b5367))

## [1.1.1](https://github.com/Avivbens/fast-alfred/compare/v1.1.0...v1.1.1) (2024-06-02)

### Bug Fixes

-   change config file to be commonjs - under `.fast-alfred.config.cjs` ❌ ([44982b4](https://github.com/Avivbens/fast-alfred/commit/44982b4a645d357b6e540b9670d7f0b32d32bc73))

# [1.1.0](https://github.com/Avivbens/fast-alfred/compare/v1.0.0...v1.1.0) (2024-06-02)

### Features

-   support `workflowMetadata` configuration to update `info.plist` on new release 🥷 ([f8478ba](https://github.com/Avivbens/fast-alfred/commit/f8478ba4888e05263d97ecf682e709f6a101b8fc))

# 1.0.0 (2024-06-02)

### Features

-   full API for `FastAlfred` - all basic needs for scripting 🥷 ([c069314](https://github.com/Avivbens/fast-alfred/commit/c06931430d9e346393c2fd6a4fbd2ef0ca9606ef))
-   support `fast-alfred` bundler 🔨 ([3713494](https://github.com/Avivbens/fast-alfred/commit/37134945225689258f7eeecb757fca75d5c0c7c7))
-   support bump-up versions for workflows 🚀 ([2a1aff1](https://github.com/Avivbens/fast-alfred/commit/2a1aff1567bb65768f52fad92f3120329ad0963a))
-   support dynamic user configuration by config file ✨ ([8ef8a77](https://github.com/Avivbens/fast-alfred/commit/8ef8a774d33c772680bb9cb9c31c4d7ead4fa4d9))
