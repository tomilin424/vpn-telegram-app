module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'referralEarnings', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: false
    });

    await queryInterface.addColumn('Users', 'totalReferralEarnings', {
      type: Sequelize.FLOAT,
      defaultValue: 0,
      allowNull: false
    });

    await queryInterface.addColumn('Users', 'referralPayoutAddress', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'referralPayoutMethod', {
      type: Sequelize.ENUM('crypto', 'card'),
      allowNull: true
    });

    await queryInterface.createTable('ReferralPayments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      referrerId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'telegramId'
        }
      },
      referredId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'telegramId'
        }
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'paid', 'failed'),
        defaultValue: 'pending'
      },
      paymentMethod: {
        type: Sequelize.STRING,
        allowNull: true
      },
      paymentAddress: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'referralEarnings');
    await queryInterface.removeColumn('Users', 'totalReferralEarnings');
    await queryInterface.removeColumn('Users', 'referralPayoutAddress');
    await queryInterface.removeColumn('Users', 'referralPayoutMethod');
    await queryInterface.dropTable('ReferralPayments');
  }
}; 