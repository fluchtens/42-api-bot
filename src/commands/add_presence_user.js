const getApiToken = require("../utils/getApiToken");
const getUserInfo = require("../utils/getUserInfo");
const Database = require("../handlers/database");

module.exports = {
	name: "add_presence_user",
	run: async (client, message, args) => {
		try {
			const login = args[0];
			if (!login) {
				return (message.reply("Please enter a login!"))
			}

			const token = await getApiToken();
			const user = await getUserInfo(token, args[0]);
	
			await Database.query("INSERT INTO presence (login) SELECT ? WHERE NOT EXISTS (SELECT 1 FROM presence WHERE login = ?)", [login, login]);
			message.reply(`You have added \`${login}\` to the presence system.`)
		}
		catch (error) {
			return (message.reply("**Error:** " + error.message));
		}
	}
};
