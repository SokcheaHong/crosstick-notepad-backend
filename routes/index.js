module.exports = (app) => {
	require('../api/auth/auth.routes')(app);
	require('../api/notes/notes.routes')(app);
	require('../api/user_config/user_config.routes')(app);
};
