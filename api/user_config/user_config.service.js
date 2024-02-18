const sequelize = require('sequelize');
const Users = require('../../models').users;
const UserConfig = require('../../models').user_config;
const { TE } = require('../../utils/response');
const op = sequelize.Op;

class UserConfigService {
	async getOne(body) {
		const { userId } = body;
		const config = await UserConfig.findOne({
			where: { user_id: { [op.eq]: userId } },
		});
		return config;
	}

	async save(body) {
		const { userId, ...rest } = body;

		const user = await Users.findOne({ where: { id: { [op.eq]: userId } } });
		if (!user) TE('User not found!');

		const config = await this.getOne({ userId });

		const entity = {
			...rest,
			user_id: userId,
		};

		let result;
		if (config) {
			result = await UserConfig.update(entity, {
				where: {
					[op.and]: [
						{ user_id: { [op.eq]: userId } },
						{ id: { [op.eq]: config.id } },
					],
				},
			});
		} else {
			result = await UserConfig.create(entity);
		}

		return result;
	}
}

const userConfigService = new UserConfigService();
module.exports = userConfigService;
