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

		usersStatusMonitoring(client);
		setInterval(() => {
            usersStatusMonitoring(client);
        }, 60000);
	}
};

async function usersStatusMonitoring(client)
{
	try {
		const token = await getApiToken();
		const usersList = [
			"cortiz",
			"mgomes-d",
			"hgeissle",
			"mel-faqu",
			"fluchten",
			"sde-smed",
			"gmarchal",
			"dfinn",
			"ldrieske",
			"romvan-d",
			"rel-ouri"
		];
		const channel = client.channels.cache.get("1142781775786029128");

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
			await new Promise(resolve => setTimeout(resolve, 1000));
			const user = await getUserInfo(token, userName);
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

		const storedMessage = await channel.messages.fetch("1142782708901224488");
		await storedMessage.edit({ embeds: [embed] });
		// await channel.send({ embeds: [embed] });
	}
	catch (error) {
		console.log("Error: " + error.message)
	}
}
