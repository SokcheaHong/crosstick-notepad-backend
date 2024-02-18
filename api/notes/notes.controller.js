const notesService = require('./notes.service');
const { errorRes, successRes } = require('../../utils/response');

class NotesController {
	async getNoteList(req, res) {
		try {
			const response = await notesService.list({
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

	async viewNote(req, res) {
		try {
			const response = await notesService.view({
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

	async saveNote(req, res) {
		try {
			const response = await notesService.save({
				...req.body,
				userId: req.user.id,
			});
			return successRes({
				res,
				code: 200,
				message: 'Note saved successfully!',
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

	async deleteNote(req, res) {
		try {
			const response = await notesService.delete(req.body);
			return successRes({
				res,
				code: 200,
				message: 'Note deleted successfully!',
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

	async lockNote(req, res) {
		try {
			const response = await notesService.lock(req.body);
			return successRes({
				res,
				code: 200,
				message: 'Note locked successfully!',
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

	async addNoteToFavorite(req, res) {
		try {
			const response = await notesService.addToFavorite(req.body);
			return successRes({
				res,
				code: 200,
				message: 'Note added to favorites successfully!',
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

	async addNoteToTrash(req, res) {
		try {
			const response = await notesService.addToTrash(req.body);
			return successRes({
				res,
				code: 200,
				message: 'Note added to trash successfully!',
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

const notesController = new NotesController();
module.exports = notesController;
