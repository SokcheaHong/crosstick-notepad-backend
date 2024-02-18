'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('notes', {
			id: {
				allowNull: false,
				primaryKey: true,
				unique: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
			},
			user_id: {
				allowNull: false,
				type: Sequelize.UUID,
			},
			title: {
				allowNull: true,
				type: Sequelize.STRING(255),
			},
			body: {
				allowNull: true,
				type: Sequelize.TEXT,
			},
			is_favorite: {
				allowNull: false,
				type: Sequelize.TINYINT,
				defaultValue: 0,
			},
			is_locked: {
				allowNull: false,
				type: Sequelize.TINYINT,
				defaultValue: 0,
			},
			is_deleted: {
				allowNull: false,
				type: Sequelize.TINYINT,
				defaultValue: 0,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('notes');
	},
};
