'use strict';

const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const bcrypt_p = require('bcrypt-promise');
const jwt = require('jsonwebtoken');
const { TE, to } = require('../utils/response.js');
const constant = require('../utils/constant.js');
const CryptoService = require('../utils/services/crypto.service.js');

const cryptoService = new CryptoService(
	process.env.CRYPTO_SECRET_KEY,
	process.env.CRYPTO_IV,
	process.env.ALGORITHM
);

module.exports = (sequelize, DataTypes) => {
	class Users extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Users.init(
		{
			id: {
				allowNull: false,
				primaryKey: true,
				unique: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			username: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			email: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			password: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			role: {
				allowNull: false,
				defaultValue: 0,
				type: DataTypes.INTEGER(11),
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
			modelName: 'users',
		}
	);

	Users.beforeSave(async (user, options) => {
		let err;
		if (user.changed('password')) {
			let salt, hash;
			[err, salt] = await to(bcrypt.genSalt(10));
			if (err) TE(err.message, true);

			[err, hash] = await to(bcrypt.hash(user.password, salt));
			if (err) TE(err.message, true);

			user.password = hash;
		}
	});

	Users.prototype.comparePassword = async function (pw) {
		let err, pass;
		if (!this.password) TE('Password not matched');

		pw = cryptoService.decrypt(pw);

		[err, pass] = await to(bcrypt_p.compare(pw, this.password));
		if (err) TE(err.message, true);
		if (!pass) TE('Invalid Password', true);

		return this;
	};

	Users.prototype.getJWT = function () {
		const JWT_EXPIRATION = parseInt(constant.jwtExpiration);
		const signature =
			this.role == 1
				? constant.tokenSignature.admin
				: constant.tokenSignature.user;

		return (
			'Bearer ' +
			jwt.sign(
				{
					id: this.id,
					username: this.username,
					email: this.email,
					role: this.role,
					createdAt: this.createdAt,
				},
				signature,
				{
					expiresIn: JWT_EXPIRATION,
				}
			)
		);
	};

	Users.prototype.toWeb = function () {
		let json = this.toJSON();
		return json;
	};

	return Users;
};
