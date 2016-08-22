### AutoImport

Automatically finds, parses and provides code actions for all available imports. Only currently works with files in your folder and TypeScript.

----

<img src="http://g.recordit.co/2yRF1XeSbv.gif">

----

## Configuration

> filesToScan - Glob for which files in your workspace to scan, defaults to '**/*.ts'

> showNotifications - Controls if the annoying notifications should be shown, defaults to false

> doubleQuotes - Use double quotes rather than single

> spaceBetweenBraces - Difference between import {test} and import { test }

----

## Roadmap

- 0.9 - Automatically install and use npm packages
- 0.8 - Full node_modules support, merge imports and ability to organize

----

## Changelog

### 0.8

- Nicer import paths.
- Imports are now merged if they are from the same location.
- Configuration for ' or ".
- Works on Windows.
- Now on Github.

### 0.7 / 0.7 / 0.7.2

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


