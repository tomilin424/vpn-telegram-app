module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      telegramId: process.env.ADMIN_CHAT_ID,
      username: process.env.ADMIN_USERNAME,
      isActive: true,
      subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 год
      paymentHistory: JSON.stringify([{
        date: new Date(),
        amount: 250,
        currency: 'RUB',
        type: 'subscription',
        status: 'completed'
      }]),
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
}; 