# Curveball Bot

Curveball Bot is a free Discord application designed for local Pokémon GO communities,
whether your community is based in a small town or a large city.

Its main goal is to make it easy for community members to organize meetups for in-game raids and events,
while providing a clear, chronologically ordered overview of all active meetups.

Curveball Bot uses Discord features such as built-in slash commands and modals to make creating and managing meetups
simple and accessible for everyone.

## 1. Features

Currently, Curveball Bot provides following features:

- **Create meetups using slash commands**
    - The following information can be specified:
        - **Pokémon:** Which Pokémon will be raided?
        - **Location:** Where will the meetup take place (e.g. a specific Gym)?
        - **Time:** When will the meetup start?
        - **Notes:** Optional field for additional information
    - Each meetup automatically creates a thread where participants can discuss meetup-related topics
- **Moderator role: Meetup Configurator**
    - Assign a server role that grants additional meetup-related permissions,
      such as editing or deleting meetups created by other users
- **Edit and delete meetups**
    - When a meetup is edited, Curveball Bot posts a message in the meetup thread describing exactly what has changed
- **Meetup overview**
    - All currently active meetups are listed in a dedicated channel in chronological order
- **Participate in meetups**
    - Each meetup provides interactive buttons to confirm or revoke participation
        - You can also indicate whether you are joining as a remote raider or if your participation is uncertain
- **Supported languages**
    - English
        - This language will serve as a fallback for any untranslated text
    - German

## 2. Installation

### Requirements

- Node.js
- A MySQL-compatible database

### 2.1 Create a Discord application

Visit the Discord Developer Portal and create a new application.
Make sure to save the **bot token** and **client ID** for later use.

Enable the following privileged intents for your bot:

- Presence Intent
- Server Members Intent
- Message Content Intent

### 2.2 Channels

Create the following channels in your Discord server:

1) **Meetup-Create**
    - Used to create new meetups via commands
2) **Meetup-List**
    - Displays all currently active meetups in chronological order
    - Only Curveball Bot should be allowed to send messages in this channel
3) **Meetup-Info**
    - Displays detailed information about active meetups
    - Only Curveball Bot should be allowed to send messages in this channel

### 2.3 Roles

Next, create a role that will be used as the **Meetup Configurator** role.
Users with this role will be allowed to manage meetups created by others.

### 2.4 Bot permissions

Curveball Bot needs following permissions:

#### Server permissions

Permissions to set in the server settings.

- **Manage Roles**
    - Needed for creating roles when a meetup is created
    - Also required to remove them when they are no longer needed (e.g. when the corresponding meetup is deleted)

#### Channel permissions

Permissions that are sufficient to set up meetup-related channels.

- **Manage Threads and Posts**
    - Needed for editing and deleting meetup-related threads

### 2.5 Configuration

Copy `.env.example` and create your main configuration file:

- `.env.prod`

This file contains all required configuration values for running the bot in production mode.

If you just want to run the bot without any additional setup, configuring `.env.prod` is sufficient.

Edit the file according to the comments inside `.env.example`.

#### Additional stages

You can *optionally* define configurations for additional environments:

- `.env.dev` for development
- `.env.test` for testing

These are only needed if you want to run the bot in these stages.

## 3. GO!

With all preparations done, you're ready to start the bot!
When the bot starts, it automatically sets up and updates the database by applying any pending migrations.

If you just want to run the bot normally, use the production environment:

`npm run start:prod`

This is the recommended way to run the bot.

### Additional stages

Instead of the default production setup, you can run the bot in different environments using:

- Development:
  `npm run start:dev`

- Testing:
  `npm run start:test`

These are only required if you explicitly work with multiple environments.

## Technologies and tools used

The following technologies and tools are used in this project:

- **Discord API:** [discord.js](https://discord.js.org)
- **Database / Query Builder:** [Kysely](https://kysely.dev)
- **i18n Framework:** [i18next](https://www.i18next.com/)
- **Task scheduler:** [Node cron](https://github.com/node-cron/node-cron)

## License & credits

Curveball Bot is licensed under [GNU AGPLv3](LICENSE).

You are welcome to fork, contribute to, and modify the project, but please note the following:

- **Give credit:** If you use this project, simply crediting the Curveball Bot with a link to
  this [GitHub repository](https://github.com/HighscorebreakerJoe/Curveball-Bot) is sufficient.
- **Open Source:** If you run a modified version of this bot and offer its services to others over a network (e.g.,
  hosting it for a Discord community), you must make your modified source code available to your users.
- **State changes:** If you modify or fork this project, please clearly note what changes were made.

## Disclaimer

This open-source project is a community-made tool and is not affiliated with,
endorsed by, or associated with Niantic, Scopely, Nintendo, Game Freak,
or The Pokémon Company.