const sequelize = require('sequelize');
const Notes = require('../../models').notes;
const Users = require('../../models').users;
const UsersConfig = require('../../models').user_config;
const { TE, to } = require('../../utils/response');

const op = sequelize.Op;

class NotesService {
	async list(body) {
		const {
			userId,
			search,
			isFavorite = 0,
			isLocked = 0,
			isDeleted = 0,
			page = 1,
			limit = 10,
		} = body;

		let $where = {
			user_id: { [op.eq]: userId },
			is_favorite: { [op.eq]: isFavorite },
			is_locked: { [op.eq]: isLocked },
			is_deleted: { [op.eq]: isDeleted },
		};

		let $queryObject = {
			include: [
				{
					model: Users,
					required: true,
					on: {
						id: { [op.eq]: sequelize.col('notes.user_id') },
					},
					as: 'creator',
				},
			],
		};

		if (search) {
			$where = {
				...$where,
				[op.or]: [
					{ id: { [op.eq]: search } },
					{ title: { [op.substring]: search } },
				],
			};
		}

		$queryObject.where = $where;

		if (limit > 0) {
			$queryObject.offset = page * limit;
			$queryObject.limit = limit;
		}

		const [rows, count] = await Promise.all([
			Notes.findAll({ ...$queryObject }),
			Notes.count({ where: $where }),
		]);

		return {
			notes: rows,
			metadata: {
				limit,
				page: page + 1,
				total: count,
			},
		};
	}

	async view(body) {
		const { id, userId, password } = body;
		let err, note, userConfig;
		[err, note] = await to(
			Notes.findOne({
				where: {
					[op.and]: [{ id: { [op.eq]: id }, user_id: { [op.eq]: userId } }],
				},
				include: [
					{
						model: Users,
						required: true,
						on: {
							id: { [op.eq]: sequelize.col('notes.user_id') },
						},
						as: 'creator',
					},
				],
			})
		);
		if (err) TE(err.message);
		if (!note) TE('Note not found!');

		if (note.is_locked) {
			if (!password) TE('Note require password to unlock!');
			else {
				[err, userConfig] = await to(
					UsersConfig.findOne({ where: { user_id: userId } })
				);
				if (err) TE(err.message);
				if (userConfig) {
					[err, userConfig] = await to(userConfig.compareNotePassword(password));
					if (err) TE(err.message);
				}
			}
		}

		return { note };
	}

	async save(body) {
		const { id, ...rest } = body;

		const entity = {
			...rest,
			user_id: rest.userId,
		};

		let result;
		if (id) {
			result = await Notes.update(entity, {
				where: { id: { [op.eq]: id } },
			});
		} else {
			result = await Notes.create(entity);
		}

		return result;
	}

	async delete(body) {
		const { id, userId } = body;
		const note = await this.$findOne(id, userId);
		if (!note) TE('Note not found!');
		const result = await Notes.destroy({ where: { id: { [op.eq]: id } } });
		return result;
	}

	async lock(body) {
		const { id, userId } = body;
		const note = await this.$findOne(id, userId);
		if (!note) TE('Note not found!');
		const result = await Notes.update(
			{ is_locked: state },
			{ where: { id: { [op.eq]: id } } }
		);
		return result;
	}

	async addToFavorite(body) {
		const { id, userId } = body;
		const note = await this.$findOne(id, userId);
		if (!note) TE('Note not found!');
		const result = await Notes.update(
			{ is_favorite: state },
			{ where: { id: { [op.eq]: id } } }
		);
		return result;
	}

	async addToTrash(body) {
		const { id, userId } = body;
		const note = await this.$findOne(id, userId);
		if (!note) TE('Note not found!');
		const result = await Notes.update(
			{ is_deleted: state },
			{ where: { id: { [op.eq]: id } } }
		);
		return result;
	}

	async $findOne(id, userId) {
		return Notes.findOne({
			where: { [op.and]: [{ id: { [op.eq]: id }, user_id: { [op.eq]: userId } }] },
		});
	}
}

const notesService = new NotesService();
module.exports = notesService;
