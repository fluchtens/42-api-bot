const axios = require("axios");

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

	let data = null;
	if (response.data.length > 0) {
		data = response.data[0];
	}
	if (!data) {
		throw new Error("User not found");
	}
	return (data);
}

module.exports = getUserInfo;
