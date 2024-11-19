const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
  vpnPublicKey: {
    type: DataTypes.STRING,
    allowNull: true
  },
  referralCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  referredBy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  referralCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  referralEarnings: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  totalReferralEarnings: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  referralPayoutAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  referralPayoutMethod: {
    type: DataTypes.ENUM('crypto', 'card'),
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = User; 