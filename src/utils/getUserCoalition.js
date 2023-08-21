const axios = require("axios");

async function getUserCoalition(token, userId) {
	const headers = {
		"Authorization": `Bearer ${token}`
	};

	const response = await axios.get(`https://api.intra.42.fr/v2/users/${userId}/coalitions/`, {
		headers: headers,
	});

	if (response.status !== 200) {
		throw new Error("Bad status code");
	}

	let data = null;
	if (response.data.length > 0) {
		data = response.data[0];
	}
	return (data);
}

module.exports = getUserCoalition;
