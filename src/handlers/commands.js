const fs = require("fs");
const path = require("path");

module.exports = async (client) => {
	const commandsPath = path.join(__dirname, "../commands");
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js")); 
	
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ("name" in command && "run" in command) {
			client.commands.set(command.name, command);
		} else {
			console.log(`[WARNING] The ${file} command has a missing property.`)
		}
	}
};
