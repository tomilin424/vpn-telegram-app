const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  telegramId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subscriptionEndDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  paymentHistory: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  vpnAccessKey: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Синхронизируем модель с базой данных с пересозданием таблицы
sequelize.sync({ force: true }).then(() => {
  console.log('База данных синхронизирована');
});

module.exports = User; 