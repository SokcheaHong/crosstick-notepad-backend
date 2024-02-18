'use strict';

// require('dotenv').config();
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const bcrypt_p = require('bcrypt-promise');
const { TE, to } = require('../utils/response');
const CryptoService = require('../utils/services/crypto.service');
const cryptoService = new CryptoService(
	process.env.CRYPTO_SECRET_KEY,
	process.env.CRYPTO_IV,
	process.env.ALGORITHM
);

module.exports = (sequelize, DataTypes) => {
	class UserConfig extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	UserConfig.init(
		{
			id: {
				allowNull: false,
				primaryKey: true,
				unique: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			user_id: {
				allowNull: false,
				type: DataTypes.UUID,
			},
			display_mode: {
				allowNull: true,
				type: DataTypes.STRING(16), // 'light' | 'dark' | 'system'
			},
			note_password: {
				allowNull: true,
				type: DataTypes.STRING,
			},
			createdAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
		},
		{
			sequelize,
			modelName: 'user_config',
		}
	);

	UserConfig.beforeSave(async (user_config, options) => {
		let err;
		if (user_config.changed('note_password')) {
			let salt, hash;
			[err, salt] = await to(bcrypt.genSalt(10));
			if (err) TE(err.message, true);

			[err, hash] = await to(bcrypt.hash(user_config.note_password, salt));
			if (err) TE(err.message, true);

			console.log(hash);
			user_config.note_password = hash;
		}
	});

	UserConfig.prototype.compareNotePassword = async function (pw) {
		let err, pass;
		if (!this.note_password) TE('Password not matched');

		pw = cryptoService.decrypt(pw);

		[err, pass] = await to(bcrypt_p.compare(pw, this.note_password));
		if (err) TE(err.message, true);
		if (!pass) TE('Incorrect Password', true);

		return this;
	};

	return UserConfig;
};
