const userConfigController = require('./user_config.controller');
const middleware = require('../../middleware');

class UserConfigRoutes {
	constructor(app) {
		app.post(
			'/v1/user-config/view',
			middleware.user,
			userConfigController.viewUserConfig
		);
		app.post(
			'/v1/user-config/save',
			middleware.user,
			userConfigController.saveUserConfig
		);
	}
}

module.exports = (app) => new UserConfigRoutes(app);
