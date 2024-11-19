const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReferralPayment = sequelize.define('ReferralPayment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  referrerId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'telegramId'
    }
  },
  referredId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'telegramId'
    }
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed'),
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  originalPaymentId: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = ReferralPayment; 