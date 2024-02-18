const userConfigService = require('./user_config.service');
const { errorRes, successRes } = require('../../utils/response');

class UserConfigController {
	async viewUserConfig(req, res) {
		try {
			const response = await userConfigService.getOne({ userId: req.user.id });
			return successRes({
				res,
				code: 200,
				data: response,
			});
		} catch (error) {
			console.log(error.stack);
			return errorRes({
				res,
				code: 400,
				message: error.message,
			});
		}
	}

	async saveUserConfig(req, res) {
		try {
			const response = await userConfigService.save({
				...req.body,
				userId: req.user.id,
			});
			return successRes({
				res,
				code: 200,
				data: response,
			});
		} catch (error) {
			console.log(error.stack);
			return errorRes({
				res,
				code: 400,
				message: error.message,
			});
		}
	}
}

const notesController = new UserConfigController();
module.exports = notesController;
