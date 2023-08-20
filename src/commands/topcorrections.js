const getApiToken = require("../utils/getApiToken");
const getUserInfo = require("../utils/getUserInfo");
const getAllCorrections = require("../utils/getAllCorrections");
const getCorrectedUsers = require("../utils/getCorrectedUsers");

module.exports = {
	name: "topcorrections",
	run: async (client, message, args) => {
		try {
			const token = await getApiToken();

			const user = await getUserInfo(token, args[0]);
			if (!user) {
				throw new Error("User not found");
			}

			const correctionsData = await getAllCorrections(token, user.id);
			const correctedUsers = getCorrectedUsers(correctionsData, user.id);

			const sortedData = Object.entries(correctedUsers)
				.sort((a, b) => b[1] - a[1])
				.slice(0, 15)
				.map(([person, corrections], index) => `**${index + 1}.** ${person} : ${corrections}`)
				.join("\n");

			if (!sortedData) {
				message.reply("No corrected users found.");
			} else {
				const embed = {
					color: 0x0099ff,
					title: `**${client.user.username} - Top 15 people corrected by ${user.login}**`,
					thumbnail: {
						url: user.image.versions.small
					},
					description: sortedData,
					timestamp: new Date().toISOString(),
					footer: {
						text: client.user.username,
						icon_url: client.user.displayAvatarURL()
					}
				};
				message.reply({embeds: [embed]});
            }
		}
		catch (error) {
			message.reply("**Error:** " + error.message);
			return ;
		}
	}
};
