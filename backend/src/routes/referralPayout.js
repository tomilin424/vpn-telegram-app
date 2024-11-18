const express = require('express');
const router = express.Router();
const referralPayoutService = require('../services/referralPayoutService');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// Запрос на вывод средств
router.post('/request', async (req, res) => {
  try {
    const { method, address } = req.body;
    const userId = req.telegramUser.id;
    const result = await referralPayoutService.requestPayout(userId, method, address);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получение статистики рефералов
router.get('/stats', async (req, res) => {
  try {
    const userId = req.telegramUser.id;
    const stats = await referralPayoutService.getReferralStats(userId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 