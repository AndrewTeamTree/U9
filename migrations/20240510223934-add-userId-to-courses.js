'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if the userId column already exists
      const [results] = await queryInterface.sequelize.query(
        "PRAGMA table_info('Courses')"
      );

      const columnExists = results.some((column) => column.name === 'userId');

      if (!columnExists) {
        // Add the userId column only if it doesn't exist
        await queryInterface.addColumn('Courses', 'userId', {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'NO ACTION',
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Courses', 'userId');
  },
};
