const express = require('express');
const router = express.Router();
const referralService = require('../services/referralService');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// Получение статистики рефералов
router.get('/stats', async (req, res) => {
  try {
    const userId = req.telegramUser.id;
    const stats = await referralService.getReferralStats(userId);
    res.json(stats);
  } catch (error) {
    console.error('Error getting referral stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Активация реферального кода
router.post('/activate', async (req, res) => {
  try {
    const { referralCode } = req.body;
    const userId = req.telegramUser.id;
    const result = await referralService.processReferral(userId, referralCode);
    res.json(result);
  } catch (error) {
    console.error('Error activating referral:', error);
    res.status(500).json({ error: error.message });
  }
});

// Получение списка рефералов
router.get('/list', async (req, res) => {
  try {
    const userId = req.telegramUser.id;
    const referrals = await referralService.getReferralList(userId);
    res.json(referrals);
  } catch (error) {
    console.error('Error getting referral list:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 