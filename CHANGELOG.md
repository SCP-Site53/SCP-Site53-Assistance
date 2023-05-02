# Changelog

## 2023.5.1

### Bug Fixes
* **Frontier:** fixed path typo. 

### Deprecated
* **Information Directory:** moved all files from the directory to other areas.

### Refactors
* **Infomation.json:** now called `config.json`.

## 2023.4.30

### Features
* **Github:** uploaded files to Github.
* **README.md:** created a README.md file.

## 2023.3.30

### Deprecated
* **Frontier:** deprecated `Frontier.toImportFormat` (replaced with `Frontier.fromCProtocolToFileDataProtocol`).

### Refactors
* **Frontier:** changed `Frontier.toImportFormat` to `Frontier.fromCProtocolToFileDataProtocol` and added `TypeError`s.
* **Stryder:** rewritten to utilize new features and includes some documentation.
* **Patricia:** added `TypeError`s and documentation.

### Features
* **Changelog:** added a changelog containing changes since March 1, 2023.
* **Frontier:** new contructor that makes converting file protocols easier. There is also new protocol transpilers (`Frontier.fromCProtocolToFileDataProtocol` and `Frontier.fromFileDataProtocolToCProtocol`).
* **Avatar Comamnd:** get the avatar a of a server member.

## 2023.3.20

### Bug Fixes
* **Patricia:** fixed fetching data from command files when refreshing application commands.
* **Justin:** added data to replace the missing event data.

### Deprecated
* **Frontier:** deprecated `Frontier.toImportFilePath` (use `Frontier.toImportFormat`) becuase of its name.
* **Undy:** deprecated `Undy().send` (Use `Undy.post`). 
* **Stylus:** deprecated `Stylus.message`, `Stylus.Message`, and `Stylus.Check` because it looks odd and is outdated.
* **Jazmyn:** deprecated `Jazmyn.DiscordJSInteraction` because it was replaced with `Jazmyn.DiscordJSEvent`.

### Refactors
* **Frontier:** `Frontier.toImportFormat` changes c: protocol to a file data format supported by import statements (experimental).
* **Jazmyn:** `Jazmyn.DiscordJSEvent`, unlike its predecessor, supports all discord.js events except `ClientReady`.
* **Interactions:** Added follow ups to error messages.

### Features
* **Undy:** `Undy.post` has 3 methods (`Jazmyn`), and event (required when using discord.js events), channel, and data,  parameters.
* **Stylus** `Stylus.fetchQuote` fetches quotes from application programming interfaces (optional application programming interfaces parameter).

## 2023.3.19

### Refactors
* **Configuration:** moved all `config.json` data to `information.json`.
* **File Examples:** moved files examples to a new directory.

### Features
* **EMCAScript Modules:** refactored all files to support files written only in EMCAScript Modules.
* **CommonJS Modules:** CommonJS is still support, but its in a diffrent directory.
* **Frontier:** `toImportFilePath` changes c: protocol to a file data format supported by import statements (experimental).

## 2023.3.16

### Features
* **Anime Command:** fetches anime pictures and quotes from an application programming interface.
* **Joke Command:** fetches a joke from an application programming interface.
* **Quote Command:** fetches a quote from application programming interface.

## 2023.3.12

### Features
* **Jack:** a utility class similar to `Map()`, but with additional features.

## 2023.3.10

### Bug Fixes
* **Action Row:** fixed serialization of array-like objects.
* **Error Messages:** removed `Error`s that functions improperly.

### Refactors
* **Niall:** time formats now user grammar and includes weeks, months, and years.
* **Utility Commands:** Addded a string slect menu to connect them. 

## 2023.3.6

### Refactors
* **Files:** organized files into directories (ex. fun commands are in a directory only containing fun commands).
* **Removed Action Row Builders:** replaced with objects.
* **Removed All Types of Select Menu Builders:** they were outdated and replaced with objects.
* **Removed Button Builders:** they were improperly decoding emojis and replaced with objects.

## 2023.3.2

### Refactors
* **Added slash command groups:** makes commands look better.
* **Shift Leaderboards:** Added a shift leaderboard command with JSON and TXT transpilers.

## 2023.3.1

### Features
* **Niall:** a time utility class using miliseconds.