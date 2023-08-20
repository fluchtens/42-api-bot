const mysql = require("mysql");
const Database = new mysql.createConnection({
	host: process.env.DB_IP,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DATABASE
})

Database.connect(function(err) {
	if (err) {
		throw (err);
	}
	console.log("✅ Connected to the bot database successfully.")
});

module.exports = Database;
