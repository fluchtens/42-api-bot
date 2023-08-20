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

module.exports = getCorrectorsUsers;
