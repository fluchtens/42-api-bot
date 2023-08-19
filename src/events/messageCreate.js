module.exports = {
	name: "messageCreate",
	once: false,
	execute(client, message) {
		if (message.author.bot) {
			return ;
		}

		let prefix = "!";
		if (!message.content.startsWith(prefix)) {
			return ;
		}

		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		cmdName = args.shift();
		if (!cmdName.length) {
			return ;
		}

		let cmd = client.commands.get(cmdName);
		if (cmd) {
			cmd.run(client, message, args);
		} else {
			message.reply("This command does not exist.");
			return ;
		}
	}
};
