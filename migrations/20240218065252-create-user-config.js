'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('user_configs', {
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
			display_mode: {
				allowNull: true,
				type: Sequelize.STRING(16), // 'light' | 'dark' | 'system'
			},
			note_password: {
				allowNull: true,
				type: Sequelize.STRING,
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
		await queryInterface.dropTable('user_configs');
	},
};
