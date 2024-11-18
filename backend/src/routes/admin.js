const express = require('express');
const router = express.Router();
const User = require('../models/user');
const cache = require('../utils/cache');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

// Middleware для проверки прав администратора
const adminAuth = async (req, res, next) => {
  try {
    const userId = req.telegramUser?.id;
    if (userId?.toString() !== process.env.ADMIN_CHAT_ID) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

router.use(adminAuth);

// Получение статистики
router.get('/stats', async (req, res) => {
  try {
    // Проверяем кэш
    const cachedStats = cache.get('admin_stats');
    if (cachedStats) {
      return res.json(cachedStats);
    }

    const [totalUsers, activeUsers, recentPayments, expiringSoon] = await Promise.all([
      User.count(),
      User.count({ where: { isActive: true } }),
      User.findAll({
        attributes: ['paymentHistory'],
        limit: 10,
        order: [['updatedAt', 'DESC']]
      }),
      User.count({
        where: {
          subscriptionEndDate: {
            [Op.between]: [new Date(), new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)]
          }
        }
      })
    ]);

    const stats = {
      totalUsers,
      activeUsers,
      expiringSoon,
      recentPayments: recentPayments.flatMap(u => u.paymentHistory || [])
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10)
    };

    // Кэшируем на 5 минут
    cache.set('admin_stats', stats, 300);

    res.json(stats);
  } catch (error) {
    logger.error('Error fetching admin stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Управление пользователями
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const where = search ? {
      [Op.or]: [
        { telegramId: { [Op.like]: `%${search}%` } },
        { username: { [Op.like]: `%${search}%` } }
      ]
    } : {};

    const users = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      users: users.rows,
      total: users.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(users.count / limit)
    });
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
});

// Управление подписками
router.post('/subscription/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { action, duration } = req.body;

    const user = await User.findOne({ where: { telegramId: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (action === 'extend') {
      const currentDate = new Date();
      const newEndDate = user.subscriptionEndDate && user.subscriptionEndDate > currentDate
        ? new Date(user.subscriptionEndDate.getTime() + duration * 24 * 60 * 60 * 1000)
        : new Date(currentDate.getTime() + duration * 24 * 60 * 60 * 1000);

      await user.update({
        subscriptionEndDate: newEndDate,
        isActive: true
      });

      logger.info(`Subscription extended for user ${userId} by ${duration} days`);
    } else if (action === 'cancel') {
      await user.update({
        isActive: false
      });

      logger.info(`Subscription cancelled for user ${userId}`);
    }

    res.json({ success: true });
  } catch (error) {
    logger.error('Error managing subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Проверка статуса администратора
router.get('/check', async (req, res) => {
  try {
    const userId = req.telegramUser?.id;
    const isAdmin = userId?.toString() === process.env.ADMIN_CHAT_ID;
    res.json({ isAdmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 