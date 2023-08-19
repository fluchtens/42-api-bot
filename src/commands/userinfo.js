const axios = require("axios");

module.exports = {
	name: "userinfo",
	run: async (client, message, args) => {
		try {
			const token = await getApiToken();
			const user = await getUserInfo(token, args[0]);
			if (!user) {
				throw new Error("User not found");
			}
			const exampleEmbed = {
				color: 0x0099ff,
				title: `__**${client.user.username} - Profile of ${user.displayname}**__`,
				thumbnail: {
					url: user.image.versions.small
				},
				fields: [
					{ name: "🤷‍♂️  Name", value: `\`${user.displayname}\``, inline: false },
					{ name: "📌  Login", value: `\`${user.login}\``, inline: false },
					{ name: "📧  Email", value: `\`${user.email}\``, inline: false },
					{ name: "🏊‍♂️  Pool year", value: `\`${user.pool_month} ${user.pool_year}\``, inline: false },
					{ name: "👶  Creation date", value: `\`${new Date(user.created_at).toLocaleString()}\``, inline: false },
					{ name: "🟠  Evaluation points", value: `\`${user.correction_point}\``, inline: false },
					{ name: "💵  Wallet", value: `\`${user.wallet}\``, inline: false }
				],
				timestamp: new Date().toISOString(),
				footer: {
					text: client.user.username,
					icon_url: client.user.displayAvatarURL()
				}
			};
			message.reply({embeds: [exampleEmbed]});
		}
		catch (error) {
			message.reply("**Error:** " + error.message);
			return ;
		}
	}
};

async function getApiToken() {
	const response = await axios.post("https://api.intra.42.fr/oauth/token", {
		grant_type: 'client_credentials',
		client_id: process.env.API_UID,
		client_secret: process.env.API_SECRET
	});

	if (response.status === 200) {
		return (response.data.access_token);
	} else {
		throw new Error("Unable to retrieve API access token");
	}
}

async function getUserInfo(token, login) {
	const headers = {
		"Authorization": `Bearer ${token}`
	};

	const params = {
		"filter[login]": login
	};

	const response = await axios.get("https://api.intra.42.fr/v2/users", {
		headers: headers,
		params: params
	});

	if (response.status !== 200) {
		throw new Error("Bad status code");
	}

	let userInfo = null;
		if (response.data.length > 0) {
		userInfo = response.data[0];
	}
	return (userInfo);
}
