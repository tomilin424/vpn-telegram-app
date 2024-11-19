const User = require('../models/user');
const telegramService = require('./telegramService');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

class NotificationService {
  async checkSubscriptions() {
    try {
      // Находим пользователей, у которых подписка истекает через 3 дня
      const users = await User.findAll({
        where: {
          subscriptionEndDate: {
            [Op.between]: [
              new Date(),
              new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            ]
          },
          isActive: true
        }
      });

      // Отправляем уведомления
      for (const user of users) {
        const daysLeft = Math.ceil(
          (new Date(user.subscriptionEndDate) - new Date()) / (1000 * 60 * 60 * 24)
        );

        await telegramService.sendNotification(
          user.telegramId,
          `
⚡ ZeusVPN: Подписка истекает

⚠️ Ваша подписка истекает через ${daysLeft} ${this.getDaysWord(daysLeft)}

💡 Для продления подписки:
1. Откройте приложение ZeusVPN
2. Нажмите "Подписаться"
3. Выберите удобный способ оплаты

🔥 Успейте продлить по текущей цене!
`
        );

        logger.info(`Subscription expiration notification sent to user ${user.telegramId}`);
      }

      // Деактивируем истекшие подписки
      const expiredUsers = await User.findAll({
        where: {
          subscriptionEndDate: {
            [Op.lt]: new Date()
          },
          isActive: true
        }
      });

      for (const user of expiredUsers) {
        await User.update(
          { isActive: false },
          { where: { id: user.id } }
        );

        await telegramService.sendNotification(
          user.telegramId,
          `
⚡ ZeusVPN: Подписка истекла

❌ Ваша подписка закончилась

📱 Для возобновления доступа:
1. Откройте приложение ZeusVPN
2. Оформите новую подписку

💫 Мы заботимся о вашей безопасности!
`
        );

        logger.info(`Subscription deactivated for user ${user.telegramId}`);
      }
    } catch (error) {
      logger.error('Error checking subscriptions:', error);
    }
  }

  getDaysWord(days) {
    const lastDigit = days % 10;
    const lastTwoDigits = days % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return 'дней';
    }

    switch (lastDigit) {
      case 1:
        return 'день';
      case 2:
      case 3:
      case 4:
        return 'дня';
      default:
        return 'дней';
    }
  }

  startDailyCheck() {
    // Проверяем подписки каждый день в 10:00
    this.checkSubscriptions();
    
    const checkTime = () => {
      const now = new Date();
      if (now.getHours() === 10 && now.getMinutes() === 0) {
        this.checkSubscriptions();
      }
    };

    // Проверяем каждую минуту
    setInterval(checkTime, 60000);

    logger.info('Notification service started');
  }

  async sendWelcomeMessage(userId) {
    const message = `
🎉 Добро пожаловать в ZeusVPN!

⚡ Ваш надежный VPN-сервис с молниеносной скоростью

💫 Наши преимущества:
• Безлимитный трафик
• Скорость до 1 Гбит/с
• Защита от блокировок
• Серверы по всему миру
• Поддержка 24/7

💎 Специальное предложение:
Первый месяц всего за 250₽!

🚀 Для начала использования:
1. Оформите подписку
2. Выберите сервер
3. Подключайтесь и пользуйтесь!

❓ Нужна помощь? Напишите в поддержку:
/support
`;

    await telegramService.sendNotification(userId, message);
    logger.info(`Welcome message sent to user ${userId}`);
  }
}

module.exports = new NotificationService(); 