const { ActivityType } = require("discord.js");
const getApiToken = require("../utils/getApiToken");
const getUserInfo = require("../utils/getUserInfo");
const getUserLocation = require("../utils/getUserLocation");
const Database = require("../handlers/database");

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

const storedUserStatus = {};

async function usersStatusMonitoring(client)
{
	try {
		const token = await getApiToken();

		const query = querytxt => {
			return new Promise((resolve, reject) => {
				Database.query(querytxt, (err, results) => {
				if (err) {
					reject(err);
				}
				resolve([results]);
				});
			});
		};
		const [results] = await query("SELECT login FROM presence");

		const usersList = results.map(row => row.login);
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
			welcomeMessage(client, user, userLocation);
		}
		const storedMessage = await channel.messages.fetch("1142782708901224488");
		await storedMessage.edit({ embeds: [embed] });
	}
	catch (error) {
		console.log("Error: " + error.message)
	}
}

async function welcomeMessage(client, user, userLocation)
{
	const channel = client.channels.cache.get("1142808107433611351");
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
			description: `❌ ${userLink} has just disconnected form ${computerLink}`,
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
