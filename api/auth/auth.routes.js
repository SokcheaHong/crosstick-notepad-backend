const authController = require('./auth.controller.js');

class AuthRoutes {
	constructor(app) {
		app.post('/api/v1/auth/signUp', authController.signUp);
		app.post('/api/v1/auth/signIn', authController.signIn);
		app.post('/encrypt', authController.encryptData);
		app.post('/decrypt', authController.decryptData);
	}
}

module.exports = (app) => new AuthRoutes(app);
