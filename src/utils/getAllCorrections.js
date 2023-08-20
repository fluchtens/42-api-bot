const axios = require("axios");

async function getAllCorrections(token, userId) {
	const headers = {
		"Authorization": `Bearer ${token}`
	};

	let pageNumber = 1;
	let pageData = [null];
	let totalData = [];

	while (pageData.length !== 0) {
		const response = await axios.get(`https://api.intra.42.fr/v2/users/${userId}/scale_teams/`, {
			headers: headers,
			params: {
				"page[size]": 100,
				"page[number]": pageNumber
			}
		});
		pageData = response.data;
		totalData = totalData.concat(pageData);
		pageNumber++;
	}
	return (totalData);
}

module.exports = getAllCorrections;
