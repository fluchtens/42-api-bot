const axios = require("axios");

async function getUserLocation(token, userId) {
	const headers = {
		"Authorization": `Bearer ${token}`
	};

	const response = await axios.get(`https://api.intra.42.fr/v2/users/${userId}/locations/`, {
		headers: headers,
	});

	if (response.status !== 200) {
		throw new Error("Bad status code");
	}

	let userLocation = null;
	if (response.data.length > 0) {
		userLocation = response.data[0];
	}
	return (userLocation);
}

module.exports = getUserLocation;
