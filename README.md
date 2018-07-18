# Auto Import - ES6, TS, JSX, TSX (VSCode Extension)

Automatically finds, parses and provides code actions and code completion for all available imports. Works with JavaScript (ES6) and TypeScript (TS).
Forker from old repo [vscode-extension-auto-import](https://github.com/martinoppitz/vscode-extension-auto-import)

----

<img src="https://media.giphy.com/media/l1J9FmoFwrcqr538Y/giphy.gif">

----

## Contributors

* [lukeautry](https://github.com/lukeautry)
* [martinoppitz](https://github.com/martinoppitz)
* [zhaoshengjun](https://github.com/zhaoshengjun)
* [soates](https://github.com/soates)
* [third774](https://github.com/third774)

----

## Configuration

> filesToScan - Glob for which files in your workspace to scan, defaults to '**/*.{js, jsx, ts, tsx}'

> showNotifications - Controls if the annoying notifications should be shown, defaults to false

> doubleQuotes - Use double quotes rather than single

> spaceBetweenBraces - Difference between import {test} and import { test }

> autoComplete - Adds found items to intellisense and automatically imports then

----

## Changelog

### 1.4.2

- Fix issues #1 and #13

### 1.4.1

- Add import action to quick fix menu
- Added higher order component as a configuration option

### 1.4.0

- fix jsx, tsx support
- fix infinity loop search
- fix export default keyword

### 1.3.3

- considere flow type annotations

### 1.3.1 / 1.3.2

- Update Metadata

### 1.3.0

- Fork from https://github.com/soates/Auto-Import
- Upgrade Dependencies (e.g. TypeScript >= 2.2.0)
- Add JavaScript Support (ES6)
- Merge Pull-Requests
- Fix TS Errors

### 1.2.2

- Fix for imports not being merged.

### 1.2.1

- Added optional auto completion for all known imports ( enabled by default ).
- Improved scanning and seeking speed for large projects.
- TSX Supported added, Thanks to [lukeautry](https://github.com/lukeautry "lukeautry")
- Minor bug fixes and improvements.

### 1.0.2 / 1.0.3

- Merged Pull Request from [lukeautry](https://github.com/lukeautry "lukeautry") and [zhaoshengjun](https://github.com/zhaoshengjun "zhaoshengjun") , Big thanks to both.


### 1.0.1

- Fixed breaking bug with vs 1.5.* and < TypeScript 2.0.0.

### 1.0

- Few small tweaks and fixed error with vscode 1.5.*.

### 0.9

- Added Import status bar, currently show you how many importable objects you have.
- Correctly uses configured file paths for fileWatcher.
- Fixed new exports not being immediately discovered.
- CodeAction import paths are relative to the current file.
- Typings are now excluded by default (along with node_modules and jspm_packages)

### 0.8.1

- Fixed Windows paths issue

### 0.8

- Nicer import paths.
- Imports are now merged if they are from the same location.
- Configuration for ' or ".
- Works on Windows.
- Now on Github.

### 0.7.0 / 0.7.1 / 0.7.2

- Add configuration to control notifications and files to scan
- Fixed a few bugs
- Refactored code

### 0.6.0

- Partial support for node_modules imports. AutoImport will scan your already used imports and provide them as suggestions when appropriate, so you will only need to type out your import once in one file and all other times will be handled by AutoImport. Version 0.7 will have full support for this.

### 0.5.1
- General improvements, icon added and extension will now also watch for local file changes.

----

## Todo

- Work with node_modules (@angular / underscore for example).


----

Feel free to [open an issue](https://github.com/NuclleaR/vscode-extension-auto-import/issues). [Pull requests](https://github.com/NuclleaR/vscode-extension-auto-import/pulls) are also welcome

