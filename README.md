# 🛒 Shop Discord Bot Documnetation
![kazamiShop](./assets/img/start_photo.png)

This is a template for building a Discord bot using the `discord.js`, `mongoose` libraries

## Prerequisites

Before you begin, make sure you have the following installed on your system:

- Node.js: version 16 or higher.
- npm: version 7 or higher.

## Setting up the bot

1. Clone or download this repository.
2. Navigate to the root directory of the project and create a file called `.env`.
3. Follow the instructions below to get a Discord token and a MongoDB connection string.
4. Copy the contents of `.env.example` into `.env` and fill in the necessary values for your bot.
5. Install the required packages by running the following command:

```
npm i
```

6. Complete the project using the commands below:

```
npm run build
npm run start
```
## Getting a Discord token

To use the Discord API, you need to create a Discord bot and get a token to authenticate your bot. Here's how to do that:

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and log in with your Discord account.
2. Click on the "New Application" button.
3. Give your application a name and click "Create".
4. On the left-hand side of the screen, click on the "Bot" tab.
5. Click on the "Add Bot" button.
6. Enable all intents on the Discord Developer Portal
    * Go to the Discord Developer Portal.
    * Go to the Discord Developer Portal.
    * Click on the name of your Discord application.
    * Click on the "Settings" tab.
    * Scroll down to the "Privileged Gateway Intents" section.
    * Click on the toggle switch next to each intent to enable it.
7. Copy the token that is displayed on the screen. This is the token you will use to authenticate your bot.

## Getting a MongoDB connection string

To connect to a MongoDB database, you need a connection string that specifies the hostname and port of the MongoDB server, as well as the name of the database you want to connect to. Here's how to get a connection string:

1. Sign up for a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account.
2. Create a new cluster and select the "Free Tier" option.
3. Click on the "Connect" button.
4. Follow the instructions to connect to your cluster using the MongoDB Compass GUI.
5. Click on the "Connect Your Application" button.
6. Copy the connection string that is displayed on the screen. This is the connection string you will use to connect to your MongoDB database.
