module.exports = {
	name: "help",
	description: "Do you need some help?",
	usage: "",
	run: (client, message, args) => {
		const infoEmbed = {
			color: 0x0099ff,
			title: `${client.user.username} - Informations`,
			description: "Hi, I'm a bot created in discord.js v14 that communicates with the 42 api.",
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

		const commandsEmbed = {
			color: 0x0099ff,
			title: `${client.user.username} - Commands`,
			description: "",
			thumbnail: {
				url: client.user.displayAvatarURL()
			},
			timestamp: new Date().toISOString(),
			footer: {
				text: client.user.username,
				icon_url: client.user.displayAvatarURL()
			}
		}

		const commands = client.commands;
		commands.forEach(cmd => {
			commandsEmbed.description += `**!${cmd.name}**\n*${cmd.description}*\n\n`;
		});

		message.reply({embeds: [infoEmbed, commandsEmbed]});
	}
};
