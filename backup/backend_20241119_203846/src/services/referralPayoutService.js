const User = require('../models/user');
const ReferralPayment = require('../models/referralPayment');
const telegramService = require('./telegramService');
const logger = require('../utils/logger');

class ReferralPayoutService {
  async processReferralPayout(referrerId, amount, originalPaymentId) {
    try {
      const referrer = await User.findOne({ where: { telegramId: referrerId } });
      if (!referrer) throw new Error('Referrer not found');

      // Создаем запись о реферальной выплате
      const referralPayment = await ReferralPayment.create({
        referrerId,
        referredId: originalPaymentId.split('_')[1],
        amount: amount * 0.3, // 30% от платежа
        status: 'pending',
        originalPaymentId
      });

      // Обновляем статистику реферера
      await User.update(
        {
          referralEarnings: referrer.referralEarnings + referralPayment.amount,
          totalReferralEarnings: referrer.totalReferralEarnings + referralPayment.amount
        },
        { where: { telegramId: referrerId } }
      );

      // Отправляем уведомление
      await telegramService.sendNotification(referrerId, `
🎉 Новый реферальный доход!

💰 Сумма: ${referralPayment.amount}₽
📊 Всего заработано: ${referrer.totalReferralEarnings + referralPayment.amount}₽

💫 Продолжайте приглашать друзей и зарабатывайте 30% с каждого платежа!

⚡ ZeusVPN - ваш надежный партнер
      `);

      return referralPayment;
    } catch (error) {
      logger.error('Error processing referral payout:', error);
      throw error;
    }
  }

  async getReferralStats(userId) {
    try {
      const user = await User.findOne({ where: { telegramId: userId } });
      if (!user) throw new Error('User not found');

      const referralPayments = await ReferralPayment.findAll({
        where: { referrerId: userId },
        order: [['createdAt', 'DESC']],
        limit: 10
      });

      return {
        success: true,
        referralCode: user.referralCode,
        referralCount: user.referralCount,
        currentEarnings: user.referralEarnings,
        totalEarnings: user.totalReferralEarnings,
        recentPayments: referralPayments.map(payment => ({
          amount: payment.amount,
          date: payment.createdAt,
          status: payment.status
        }))
      };
    } catch (error) {
      logger.error('Error getting referral stats:', error);
      return { success: false, error: error.message };
    }
  }

  async requestPayout(userId, method, address) {
    try {
      const user = await User.findOne({ where: { telegramId: userId } });
      if (!user) throw new Error('User not found');

      if (user.referralEarnings < 1000) {
        throw new Error('Минимальная сумма для вывода: 1000₽');
      }

      await User.update(
        {
          referralPayoutMethod: method,
          referralPayoutAddress: address,
          referralEarnings: 0 // Обнуляем текущий баланс
        },
        { where: { telegramId: userId } }
      );

      // Отправляем уведомление администратору
      await telegramService.sendNotification(process.env.ADMIN_CHAT_ID, `
📤 Новый запрос на вывод реферальных

👤 User ID: ${userId}
💰 Сумма: ${user.referralEarnings}₽
💳 Метод: ${method}
📧 Адрес: ${address}

Для подтверждения:
/confirm_payout ${userId}
      `);

      return { success: true };
    } catch (error) {
      logger.error('Error requesting payout:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new ReferralPayoutService(); 