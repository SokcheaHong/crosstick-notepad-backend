const authService = require('./auth.service');
const { errorRes, successRes } = require('../../utils/response.js');

class AuthController {
	async signUp(req, res) {
		try {
			const response = await authService.signUp(req.body);
			return successRes({
				res,
				code: 200,
				message: 'You signed up successful!',
				data: response,
			});
		} catch (error) {
			console.log(error.stack);
			res.status(400).json({
				success: false,
				error: true,
				message: error.message,
			});
		}
	}

	async signIn(req, res) {
		try {
			const response = await authService.signIn(req.body);
			return successRes({
				res,
				code: 200,
				message: 'You signed in successful!',
				data: response,
			});
		} catch (err) {
			console.log(err.stack);
			return errorRes({ res, code: 400, message: err.message });
		}
	}

	encryptData(req, res) {
		try {
			const result = authService.encryptData(req.body.plain);
			res.json({ data: result });
		} catch (error) {
			res.json({ message: error.message });
		}
	}

	decryptData(req, res) {
		try {
			const result = authService.decryptData(req.body.encrypted);
			res.json({ data: result });
		} catch (error) {
			res.json({ message: error.message });
		}
	}
}

const authController = new AuthController();
module.exports = authController;
