const { Telegraf } = require('telegraf');
const User = require('../models/User');

class PaymentProcessor {
  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN);
    this.provider_token = process.env.PAYMENT_PROVIDER_TOKEN;
  }

  async processPayment(paymentData) {
    try {
      const { telegramId, amount, subscriptionType } = paymentData;
      
      // Создаем тестовый счет для оплаты
      const invoice = {
        provider_token: this.provider_token,
        start_parameter: 'vpn_subscription',
        title: 'Подписка на VPN сервис',
        description: `Подписка на ${subscriptionType} месяц`,
        currency: 'RUB',
        prices: [
          { 
            label: `Подписка на ${subscriptionType} месяц`, 
            amount: amount * 100 // в копейках
          }
        ],
        payload: JSON.stringify({
          telegramId,
          subscriptionType,
          timestamp: Date.now()
        }),
        // Добавляем параметры для тестовой оплаты
        is_test: true,
        need_name: true,
        need_phone_number: true,
        need_email: true,
        send_phone_number_to_provider: true,
        send_email_to_provider: true,
        photo_url: 'https://i.imgur.com/vIZ2QP5.png', // URL логотипа
        photo_size: 500,
        photo_width: 500,
        photo_height: 500
      };

      return invoice;
    } catch (error) {
      console.error('Ошибка при создании платежа:', error);
      throw new Error('Ошибка при создании платежа');
    }
  }

  async verifyPayment(paymentInfo) {
    try {
      const { payload, total_amount } = paymentInfo;
      const payloadData = JSON.parse(payload);
      
      // Проверяем валидность платежа
      if (total_amount < 100) {
        throw new Error('Некорректная сумма платежа');
      }

      // Проверяем время платежа
      const paymentTime = new Date(payloadData.timestamp);
      const now = new Date();
      if (now - paymentTime > 3600000) { // 1 час
        throw new Error('Платеж устарел');
      }

      return true;
    } catch (error) {
      console.error('Ошибка при проверке платежа:', error);
      return false;
    }
  }

  async activateSubscription(telegramId, subscriptionType) {
    try {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + subscriptionType);

      await User.updateSubscription(telegramId, {
        isActive: true,
        startDate: new Date(),
        endDate: endDate
      });

      // Отправляем уведомление пользователю
      await this.bot.telegram.sendMessage(telegramId,
        '✅ Подписка успешно активирована!\n\n' +
        `Срок действия: до ${endDate.toLocaleDateString()}\n` +
        'Теперь вы можете подключить VPN в приложении.'
      );

      return true;
    } catch (error) {
      console.error('Ошибка при активации подписки:', error);
      throw new Error('Ошибка при активации подписки');
    }
  }

  getSubscriptionPrice(type) {
    const prices = {
      1: 250,  // 1 месяц
      3: 600,  // 3 месяца
      6: 1000, // 6 месяцев
      12: 1800 // 12 месяцев
    };
    return prices[type] || prices[1];
  }

  // Добавить обработку событий после успешной оплаты
  async handleSuccessfulPayment(userId, subscriptionType) {
    try {
      // 1. Активируем подписку
      await this.activateSubscription(userId, subscriptionType);
      
      // 2. Генерируем VPN конфигурацию через VPNService
      const vpnService = require('./vpnService');
      const configResult = await vpnService.createConfig(userId);
      
      if (!configResult.success) {
        throw new Error('Ошибка при создании VPN конфигурации');
      }

      // 3. Отправляем конфигурацию пользователю
      await this.bot.telegram.sendDocument(userId, {
        source: configResult.configFile,
        filename: 'vpn-config.conf'
      }, {
        caption: 'Ваша VPN конфигурация готова! Следуйте инструкции по установке в приложении.'
      });

      return { success: true };
    } catch (error) {
      console.error('Ошибка при обработке успешного платежа:', error);
      throw error;
    }
  }
}

module.exports = new PaymentProcessor(); 