const sequelize = require('sequelize');
const validator = require('validator');
const { TE, to } = require('../../utils/response.js');
const CryptoService = require('../../utils/services/crypto.service.js');
const Users = require('../../models').users;
const op = sequelize.Op;

const cryptoService = new CryptoService(
	process.env.CRYPTO_SECRET_KEY,
	process.env.CRYPTO_IV,
	process.env.ALGORITHM
);

class AuthService {
	async signUp(body) {
		const { username, email, password, role = 0 } = body;
		if (!username) TE('Username is required.');
		if (!username) TE('Password is required.');
		if (!validator.isEmail(email)) TE('Invalid email.');
		const isEmailUsed = await Users.findOne({
			where: {
				email: { [op.eq]: email },
			},
		});
		if (isEmailUsed) TE('Email has already been registered.');
		const user = await Users.create({ username, email, password, role });
		return { token: user.getJWT(), user: user.toWeb() };
	}

	async signIn(body) {
		const { email, password } = body;
		let err, user;
		[err, user] = await to(
			Users.findOne({ where: { email: { [op.eq]: email } } })
		);
		if (!user) TE('User not found!');
		[err, user] = await to(user.comparePassword(password));
		if (err) {
			console.log(new Date(), err.stack);
			TE(err.message);
		}
		return { token: user.getJWT(), user: user.toWeb() };
	}

	encryptData(plain) {
		return cryptoService.encrypt(plain);
	}

	decryptData(encrypted) {
		return cryptoService.decrypt(encrypted);
	}
}

const authService = new AuthService();
module.exports = authService;
