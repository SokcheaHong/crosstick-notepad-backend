const jwt = require('jsonwebtoken');
const constant = require('../utils/constant.js');
const { errorRes } = require('../utils/response.js');

class MiddleWare {
	async user(req, res, next) {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];
		if (!token || typeof token === 'undefined') {
			return errorRes({ res, code: 401, message: 'Missing token!' });
		}

		jwt.verify(token, constant.tokenSignature.user, function (error, user) {
			if (error) {
				let errObj = {};
				let message = 'Something went wrong!';

				if (typeof error === 'object') {
					errObj = Object.keys(error).reduce((acc, curr) => {
						if (typeof acc !== 'undefined') {
							acc[curr] = error[curr];
						}
						return acc;
					}, {});
				}

				switch (errObj?.name) {
					case 'JsonWebTokenError':
						message = 'The token you provide is invalid!';
						break;
					case 'TokenExpiredError':
						message = 'Your login session had been expired!';
						break;
					default:
						message = 'Something went wrong!';
				}

				return errorRes({ res, code: 400, message });
			}
			req.user = user;
			next();
		});
	}
}
const middleware = new MiddleWare();
module.exports = middleware;
