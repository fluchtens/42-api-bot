const getApiToken = require("../utils/getApiToken");
const getUserInfo = require("../utils/getUserInfo");
const getAllCorrections = require("../utils/getAllCorrections");

module.exports = {
	name: "topcorrectors",
	run: async (client, message, args) => {
		try {
			const login = args[0];
			if (!login) {
				return (message.reply("Please enter a login!"))
			}

			const token = await getApiToken();
			const user = await getUserInfo(token, login);
			const correctionsData = await getAllCorrections(token, user.id);
			const correctedUsers = getCorrectorsUsers(correctionsData, user.id);

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
					title: `**${client.user.username} - Top 15 people who corrected ${user.login}**`,
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
		}
	}
};

function getCorrectorsUsers(correctionsData, userId) {
	const correctorsUsers = {};

	for (const eval of correctionsData) {
		for (const corrected of eval.correcteds) {
			if (corrected.id === userId) {
				if (eval.corrector.login in correctorsUsers) {
					correctorsUsers[eval.corrector.login] += 1;
				} else {
					correctorsUsers[eval.corrector.login] = 1;
				}
			}
		}
	}
	return (correctorsUsers);
}
