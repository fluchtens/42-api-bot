# 42-discord-bot
A discord bot that communicates with the 42 api.

### Required to work
- Node.js
- npm
- pm2

### Installation :
- Clone the repository.
- Run ```npm i``` to install the project dependencies.

### Configuration:
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
