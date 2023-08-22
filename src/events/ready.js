const { ActivityType } = require("discord.js");
const db = require("../handlers/database");
const config = require("../../config.json");
const getApiToken = require("../utils/getApiToken");
const getUserInfo = require("../utils/getUserInfo");
const getUserLocation = require("../utils/getUserLocation");

module.exports = {
	name: "ready",
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`)
		client.user.setActivity("42 Network.", { type: ActivityType.Watching });

		if (config.presence_monitoring.enable) {
			usersPresenceMonitoring(client);
			setInterval(() => {
				usersPresenceMonitoring(client);
			}, config.presence_monitoring.interval * 60000);
		}
	}
};

async function usersPresenceMonitoring(client)
{
	try {
		const token = await getApiToken();

		const query = querytxt => {
			return new Promise((resolve, reject) => {
				db.query(querytxt, (err, results) => {
				if (err) {
					reject(err);
				}
				resolve([results]);
				});
			});
		};
		const [results] = await query("SELECT login FROM presence");

		const usersList = results.map(row => row.login);
		const channel = client.channels.cache.get(config.presence_monitoring.channel_id);

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
			if (config.presence_logs.enable) {
				welcomeMessage(client, user, userLocation);
			}
		}
		const storedMessage = await channel.messages.fetch(config.presence_monitoring.message_id);
		await storedMessage.edit({ embeds: [embed] });
	}
	catch (error) {
		console.log("Error: " + error.message)
	}
}

const storedUserStatus = {};

async function welcomeMessage(client, user, userLocation)
{
	const channel = client.channels.cache.get(config.presence_logs.channel_id);
	let userLink = `[${user.login}](https://profile.intra.42.fr/users/${user.login})`;
	let computerLink = `[${userLocation.host}](https://meta.intra.42.fr/clusters#${userLocation.host})`;

	if (!userLocation.end_at && storedUserStatus[user.login] === "Unavailable") {
		let embed = {
			color: 0x32db65,
			title: `**${client.user.username} - ${user.displayname} is available**`,
			thumbnail: {
				url: user.image.versions.small
			},
			description: `✅ ${userLink} has just connected to ${computerLink}`,
			timestamp: new Date().toISOString(),
			footer: {
				text: client.user.username,
				icon_url: client.user.displayAvatarURL()
			},
		};
		await channel.send({ embeds: [embed] });
	}
	if (userLocation.end_at && storedUserStatus[user.login] === "Available") {
		let embed = {
			color: 0xeb4034,
			title: `**${client.user.username} - ${user.displayname} is unavailable**`,
			thumbnail: {
				url: user.image.versions.small
			},
			description: `❌ ${userLink} has just disconnected from ${computerLink}`,
			timestamp: new Date().toISOString(),
			footer: {
				text: client.user.username,
				icon_url: client.user.displayAvatarURL()
			},
		};
		await channel.send({ embeds: [embed] });
	}
	storedUserStatus[user.login] = userLocation.end_at ? "Unavailable" : "Available";
}
