const getApiToken = require("../utils/getApiToken");
const getUserInfo = require("../utils/getUserInfo");
const Database = require("../handlers/database");

module.exports = {
	name: "remove_presence_user",
	description: "Remove a user form the presence status system",
	usage: "<login>",
	run: async (client, message, args) => {
		try {
			const login = args[0];
			if (!login) {
				return (message.reply("Please enter a login!"))
			}

			const token = await getApiToken();
			const user = await getUserInfo(token, args[0]);
	
			await Database.query("DELETE FROM presence WHERE login = ?", [login]);
			message.reply(`You have removed  \`${login}\` from the presence system.`)
		}
		catch (error) {
			return (message.reply("**Error:** " + error.message));
		}
	}
};
