require('dotenv').config();

module.exports = {
	port: process.env.PORT,
	jwtExpiration: process.env.JWT_EXPIRATION,
	tokenSignature: {
		admin: process.env.ADMIN_TOKEN_SIGNATURE,
		user: process.env.USER_TOKEN_SIGNATURE,
	},
};
