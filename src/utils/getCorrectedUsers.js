function getCorrectedUsers(correctionsData, userId) {
	const correctedUsers = {};

	for (const eval of correctionsData) {
		if (eval.corrector.id === userId) {
			for (const corrected of eval.correcteds) {
				if (corrected.login in correctedUsers) {
					correctedUsers[corrected.login] += 1;
				} else {
					correctedUsers[corrected.login] = 1;
				}
			}
		}
	}
	return (correctedUsers);
}

module.exports = getCorrectedUsers;
