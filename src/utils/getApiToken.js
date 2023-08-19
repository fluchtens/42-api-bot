const axios = require("axios");

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

module.exports = getApiToken;
