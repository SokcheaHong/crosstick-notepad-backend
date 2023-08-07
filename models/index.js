"use strict";

require("dotenv").config();
const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);

const db = {};

const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		logging: false,
		dialect: process.env.DB_DIALECT,
		timezone: "+07:00",
		subQuery: false,
		operatorsAliases: false,
		dialectOptions: {
			dateStrings: true,
			typeCast: true,
			timezone: "+07:00",
			decimalNumbers: true,
		},
	}
);

fs
	.readdirSync(__dirname)
	.filter((file) => {
		return (
			file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
		);
	})
	.forEach((file) => {
		const model = sequelize["import"](path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
