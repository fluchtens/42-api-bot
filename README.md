# 42-discord-bot

### What's this about?
This project is a Discord bot that communicates with API 42 to retrieve information from the intranet.  
I created it in Discord.js v14 with the main aim of learning how APIs work.

### Features
- Activity monitoring system, a message that updates every x minutes to show the position of all the people configured in the database.
- Activity log system, messages that are sent to a channel automatically when someone logs on or off a workstation.
- Commands for interacting with a 42 user, use the help command to see the list of commands.

### Required to work
- Node.js
- npm
- mysql
- pm2 (optional)

### Installation :
- Clone the repository.
- Run ```npm i``` to install the project dependencies.

### Configuration:
- Create a mysql database by importing the database.sql file.
- Create an .env file at the root of the directory and add the following content to it.
```env
TOKEN=
API_UID=
API_SECRET=

DB_IP=
DB_USER=
DB_PASSWORD=
DB_NAME=
```
- Configure the token of your discord bot, the uid and secret id of your api 42 application and your database information.
- Configure the information in the config.json file.

### Usage:
```node src/index.js```
or
```pm2 start src/index.js```
