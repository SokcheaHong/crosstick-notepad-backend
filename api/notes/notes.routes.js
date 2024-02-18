const notesController = require('./notes.controller');
const middleware = require('../../middleware');

class NotesRoutes {
	constructor(app) {
		app.post('/v1/notes/list', middleware.user, notesController.getNoteList);
		app.post('/v1/notes/view', middleware.user, notesController.viewNote);
		app.post('/v1/notes/save', middleware.user, notesController.saveNote);
		app.post('/v1/notes/delete', middleware.user, notesController.deleteNote);
		app.post('/v1/notes/lock', middleware.user, notesController.lockNote);
		app.post(
			'/v1/notes/add-to-favorite',
			middleware.user,
			notesController.addNoteToFavorite
		);
		app.post(
			'/v1/notes/add-to-trash',
			middleware.user,
			notesController.addNoteToTrash
		);
	}
}

module.exports = (app) => new NotesRoutes(app);
