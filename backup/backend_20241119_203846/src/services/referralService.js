const User = require('../models/user');
const crypto = require('crypto');
const telegramService = require('./telegramService');

class ReferralService {
  async generateReferralCode(userId) {
    const code = crypto.randomBytes(4).toString('hex');
    await User.update(
      { referralCode: code },
      { where: { telegramId: userId } }
    );
    return code;
  }

  async processReferral(userId, referralCode) {
    try {
      // Находим владельца реферального кода
      const referrer = await User.findOne({
        where: { referralCode }
      });

      if (!referrer) {
        return { success: false, error: 'Invalid referral code' };
      }

      // Проверяем, не пытается ли пользователь использовать свой код
      if (referrer.telegramId === userId) {
        return { success: false, error: 'Cannot use own referral code' };
      }

      // Обновляем данные реферера
      await User.update(
        {
          referralCount: referrer.referralCount + 1,
          bonusDays: referrer.bonusDays + 7 // 7 дней бонуса за реферала
        },
        { where: { id: referrer.id } }
      );

      // Обновляем данные приглашенного пользователя
      await User.update(
        {
          referredBy: referrer.telegramId,
          bonusDays: 3 // 3 дня бонуса для нового пользователя
        },
        { where: { telegramId: userId } }
      );

      // Отправляем уведомления
      await telegramService.sendNotification(
        referrer.telegramId,
        `🎉 По вашей рекомендации зарегистрировался новый пользователь!\n\n⚡ Вам начислено 7 дней бонусного VPN!`
      );

      await telegramService.sendNotification(
        userId,
        `🎉 Вы успешно активировали реферальный код!\n\n⚡ Вам начислено 3 дня бонусного VPN!`
      );

      return { success: true };
    } catch (error) {
      console.error('Error processing referral:', error);
      return { success: false, error: error.message };
    }
  }

  async getReferralStats(userId) {
    try {
      const user = await User.findOne({
        where: { telegramId: userId }
      });

      return {
        success: true,
        referralCode: user.referralCode || await this.generateReferralCode(userId),
        referralCount: user.referralCount,
        bonusDays: user.bonusDays
      };
    } catch (error) {
      console.error('Error getting referral stats:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new ReferralService(); 