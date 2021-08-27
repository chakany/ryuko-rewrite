<h1 align="center">Ryuko</h1>
<p align="center">Version 2 of the <a href="https://ryuko.cc">Ryuko Discord Bot</a></p>
<p align="center" href="https://github.com/jacany/ryuko-rewrite/actions/workflows/ci.yml"><img src="https://github.com/jacany/ryuko-rewrite/actions/workflows/ci.yml/badge.svg" /></p>

---

# Introduction

This is a full rewrite of the Ryuko Discord Bot, it exists because of the release of Discord.js v13 having so many breaking changes, along with Discord itself shifting torwards Slash Commands.

# Structure

The Project takes on a Monorepo Style. All major components are seperated into their own modules, and almost everything is object-oriented.

| Directory | Purpose                                                                 |
| --------- | ----------------------------------------------------------------------- |
| `bot`     | The bot that will run on your hardware.                                 |
| `handler` | A completely custom Akairo-Like Command handler with a few differences. |

### bot

| Directory        | Purpose                                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `app`            | Hold all data files, like wiki pages                                                                                                             |
| `app/components` | All `ejs` reusable components used in the website                                                                                                |
| `app/pages`      | All `ejs` general pages used in the website                                                                                                      |
| `app/static`     | Static files like images, stylesheets, etc.                                                                                                      |
| `app/wiki`       | All Wiki pages written in `ejs`                                                                                                                  |
| `src`            | Hold all general source code                                                                                                                     |
| `src/commands`   | Holds all Command Modules that will be loaded by the `handler` at bot initilization                                                              |
| `src/listeners`  | `EventEmitter` Event Listeners that will be loaded _and_ binded to by the `handler` at bot initilization                                         |
| `src/models`     | `sequelize` Models for Database Schemas                                                                                                          |
| `src/routes`     | `express` Routers as individual files used for the webserver                                                                                     |
| `src/struct`     | Various Classes that are either extensions or new ones to provide for easy internal customization without modifying other aspects of the project |
| `src/styles`     | Sass `scss` stylesheets for the website                                                                                                          |
| `src/util`       | Various utilities used for various tasks like connecting to databases, managing wiki pages, and paginating arrays.                               |

### handler

| Directory         | Purpose                                                                                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `struct`          | Hold all basic class-based structures for extending upon, provides a base Handler that can find all files of a class (`Module` class by default), and require them.    |
| `struct/command`  | Extensions of classes from the base `struct` folder, provides a Command Handler that can handle Discord Interaction data including registering, and handling commands. |
| `struct/listener` | Extensions of classes from the base `struct` folder, provides a Listener Handler that can bind all events to their proper handler                                      |

# Usage

## Prerequsites

#### Building

-   The [Yarn Package Manager](https://yarnpkg.com)

#### Running

-   A [Discord Bot Accout](https://discord.com/developers/applications) for connecting to Discord
-   A Webserver for Reverse-Proxying the internal webserver for running Member Verification, and the general website
-   A [Google ReCAPTCHA v2](https://www.google.com/recaptcha/about/) Site Key for Member Verification
-   A [Redis](https://redis.io/) Server for Member Verification
-   A [MariaDB](https://mariadb.org) Server for Persistent Data Storage

## Development

Various aspects can be run in development mode for features like automatic-rebuilding.

| Directory | Command      | Purpose                                                                                                                                                                   |
| --------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| root      | `yarn dev`   | Watch all TypeScript source files from all projects perform incremental rebuilds                                                                                          |
| `bot`     | `yarn dev`   | Running the bot itself in dev mode for quick transpiling, automatic restarts, and more detailed logging. This runs the entirety of the bot from shardmanager to webserver |
| `bot`     | `yarn watch` | Watching all sass stylesheets for changes, and then rebuilding them when they are found                                                                                   |
| `handler` | `yarn dev`   | Watch all source files and rebuild them                                                                                                                                   |

## Building

Since the bot and all of it's in-house components are written in TypeScript, you must build it.

Before you do **ANYTHING**, install all dependencies with `yarn` in the root directory. This should install all dependencies that are used within all modules of the project.

| Project   | Command                             |
| --------- | ----------------------------------- |
| All       | `yarn build` in root directory      |
| `bot`     | `yarn build` in `bot` directory     |
| `handler` | `yarn build` in `handler` directory |

#### Styles

Building styles is different.

All colors can be customized in `src/styles/base.scss` with the variables.

They should look something like this by default

```scss
$body-bg: #2b2a2a;
$body-color: white;
$primary-color: #e22525;
$body-accent: #222;
$lighter-accent: #3d3d3d;
```

All of these color variables are changeable, but when changed will require a rebuild of all styles.

##### Building

`cd` into the `bot` directory and run `yarn style`, this will build all of the styles inside of `src/styles`, and dump them into `app/static/styles`.

## Running

Once you have built the entire project, `cd` into the `bot` directory, copy `config.example.json` into `config.json`, and fill it out with all of the nessary values. These should be self explanitory.

Once you want to actually run the bot, make sure you are still in the `bot` directory and run `yarn start`. This will start the bot's shardmanager, and will do all of the sharding stuff.
