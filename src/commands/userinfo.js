const getApiToken = require("../utils/getApiToken");
const getUserInfo = require("../utils/getUserInfo");
const getUserLocation = require("../utils/getUserLocation");

module.exports = {
	name: "userinfo",
	run: async (client, message, args) => {
		try {
			const login = args[0];
			if (!login) {
				return (message.reply("Please enter a login!"))
			}

			const token = await getApiToken();
			const user = await getUserInfo(token, login);
			const userLocation = await getUserLocation(token, user.id);

			let userLastConnection = "";
			if (userLocation.end_at) {
				userLastConnection = new Date(userLocation.end_at).toLocaleString();
			} else {
				userLastConnection = "Now";
			}

			const embed = {
				color: 0x0099ff,
				title: `__**${client.user.username} - Profile of ${user.displayname}**__`,
				thumbnail: {
					url: user.image.versions.small
				},
				fields: [
					{ name: "🤷‍♂️  Name", value: `\`${user.displayname}\``, inline: false },
					{ name: "📌  Login", value: `\`${user.login}\``, inline: false },
					{ name: "📧  Email", value: `\`${user.email}\``, inline: false },
					{ name: "🟠  Evaluation points", value: `\`${user.correction_point}\``, inline: false },
					{ name: "💵  Wallet", value: `\`${user.wallet}\``, inline: false },
					{ name: "🏊‍♂️  Pool year", value: `\`${user.pool_month} ${user.pool_year}\``, inline: false },
					{ name: "👶  Creation date", value: `\`${new Date(user.created_at).toLocaleString()}\``, inline: false },
					{ name: "🚪  Last connection date", value: `\`${userLastConnection}\``, inline: false }
				],
				timestamp: new Date().toISOString(),
				footer: {
					text: client.user.username,
					icon_url: client.user.displayAvatarURL()
				}
			};
			message.reply({embeds: [embed]});
		}
		catch (error) {
			message.reply("**Error:** " + error.message);
		}
	}
};
