'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Notes extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of DataTypes lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsTo(models.users, { foreignKey: 'id', as: 'creator' });
		}
	}
	Notes.init(
		{
			id: {
				allowNull: false,
				primaryKey: true,
				unique: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			user_id: {
				allowNull: false,
				type: DataTypes.UUID,
			},
			title: {
				allowNull: true,
				type: DataTypes.STRING(255),
			},
			body: {
				allowNull: true,
				type: DataTypes.TEXT,
			},
			is_favorite: {
				allowNull: false,
				type: DataTypes.TINYINT,
				defaultValue: 0,
			},
			is_locked: {
				allowNull: false,
				type: DataTypes.TINYINT,
				defaultValue: 0,
			},
			is_deleted: {
				allowNull: false,
				type: DataTypes.TINYINT,
				defaultValue: 0,
			},
			createdAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
			},
		},
		{
			sequelize,
			modelName: 'notes',
		}
	);
	return Notes;
};
