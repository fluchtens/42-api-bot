const { ActivityType } = require("discord.js");
const getApiToken = require("../utils/getApiToken");
const getUserInfo = require("../utils/getUserInfo");
const getUserLocation = require("../utils/getUserLocation");

module.exports = {
	name: "ready",
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`)
		client.user.setActivity("42 Network.", { type: ActivityType.Watching });

		startUsersStatusMonitoring(client);
	}
};

async function startUsersStatusMonitoring(client)
{
	try {
		const token = await getApiToken();
		const usersList = ["cchabeau", "fluchten"];
		const channel = client.channels.cache.get("1142761398640844901");

		const embed = {
			color: 0x0099ff,
			title: `**${client.user.username} - Users status monitoring**`,
			thumbnail: {
				url: client.user.displayAvatarURL()
			},
			timestamp: new Date().toISOString(),
			footer: {
				text: client.user.username,
				icon_url: client.user.displayAvatarURL()
			},
			fields: []
		};

		for (const userName of usersList) {
			const user = await getUserInfo(token, userName);
			if (!user) {
				throw new Error("User not found");
			}
			const userLocation = await getUserLocation(token, user.id);
			const userLogin = userLocation.end_at ? `❌ ${user.login}` : `✅ ${user.login}`;
			let userStatus = "";
			if (userLocation.end_at) {
				userStatus = "Unavailable";
			} else {
				userStatus = `[${userLocation.host}](https://meta.intra.42.fr/clusters#${userLocation.host})`;
			}
            embed.fields.push({ name: userLogin, value: userStatus, inline: true });
		}
		await channel.send({ embeds: [embed] });
	}
	catch (error) {
		console.log("Error: " + error.message)
	}
}
