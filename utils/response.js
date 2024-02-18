const pe = require('parse-error');
const { to } = require('await-to-js');

module.exports = {
	async to(promise) {
		let err, res;
		[err, res] = await to(promise);
		if (err) return [pe(err)];

		return [null, res];
	},

	TE(err_message, log) {
		// TE stands for Throw Error
		if (log === true) {
			console.error(new Date(), err_message);
		}

		throw new Error(err_message);
	},

	errorRes({ res, code = 400, message, data = null }) {
		let errorStatus = 'Internal Server Error';
		switch (code) {
			case 400:
				errorStatus = 'Bad Request';
				break;
			case 401:
				errorStatus = 'Unauthorized';
				break;
			case 403:
				errorStatus = 'Forbidden';
				break;
			case 404:
				errorStatus = 'Not Found';
				break;
			case 429:
				errorStatus = 'To many request';
				break;
			case 500:
				errorStatus = 'Internal Server Error';
				break;
		}

		const buildResponse = {
			success: false,
			error: errorStatus,
			message: message ?? errorStatus,
		};
		if (data) buildResponse.data = data;

		return res.status(code).json(buildResponse);
	},

	successRes({ res, code = 200, message = 'Success!', data = null }) {
		const buildResponse = {
			success: true,
			message: message,
		};

		if (data) buildResponse.data = data;

		return res.status(code).json(buildResponse);
	},
};
