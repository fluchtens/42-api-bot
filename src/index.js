const { Client, Collection } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();

const client = new Client({ intents: 3276799 });

client.commands = new Collection();

const handlers = {
	events: require("./handlers/events"),
	commands: require("./handlers/commands")
}

handlers.events(client);
handlers.commands(client);

client.login(process.env.TOKEN);
