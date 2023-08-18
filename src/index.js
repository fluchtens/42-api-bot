const { Client } = require("discord.js");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const bot = new Client({ intents: 3276799 });

bot.once("ready", () => {
	console.log(`${bot.user.username} is started!`)
});

bot.on("messageCreate", async (message) => {
	if (message.author.bot) {
		return ;
	}

	if (message.content.startsWith("!userinfo")) {
		try {
			const args = message.content.split(" ");
			if (args.length !== 2) {
				message.reply("Usage: !userinfo <login>");
				return ;
			}

			const token = await getApiToken();
			const user = await getUserInfo(token, args[1]);

			const exampleEmbed = {
				color: 0x0099ff,
				title: `__**${bot.user.username} - Profile of ${user.displayname}**__`,
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
					text: bot.user.username,
					icon_url: bot.user.displayAvatarURL()
				}
			};
			message.reply({embeds: [exampleEmbed]});
		}
		catch (error) {
			message.reply("Error: " + error.message);
		}
	}
});

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

bot.login(process.env.TOKEN);
