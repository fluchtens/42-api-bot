module.exports = {
	name: "help",
	run: (client, message, args) => {
		const embed = {
			color: 0x0099ff,
			title: `${client.user.username} - INFORMATIONS`,
			description: "Hello, I'm a bot created in discord.js v14 that communicates with the 42 api.",
			thumbnail: {
				url: client.user.displayAvatarURL()
			},
			fields: [
				{ name: "Developer", value: "https://github.com/fluchtens", inline: false },
				{ name: "Source code", value: "https://github.com/fluchtens/42-discord-bot", inline: false },
			],
			timestamp: new Date().toISOString(),
			footer: {
				text: client.user.username,
				icon_url: client.user.displayAvatarURL()
			}
		};
		message.reply({embeds: [embed]});
	}
};
