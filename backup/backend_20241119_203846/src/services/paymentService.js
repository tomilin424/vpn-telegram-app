const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;
const User = require('../models/user');
const telegramService = require('./telegramService');
const { Op } = require('sequelize');

class PaymentService {
  async createCardPayment(userId, amount) {
    try {
      if (!stripe) {
        return { success: false, error: 'Stripe payments are not configured' };
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'rub',
            product_data: {
              name: 'ZeusVPN - Месячная подписка',
              description: '⚡ Безлимитный доступ ко всем серверам',
              images: ['https://example.com/zeus-vpn-logo.png']
            },
            unit_amount: 25000, // 250 рублей в копейках
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        metadata: { userId }
      });

      return { success: true, paymentUrl: session.url };
    } catch (error) {
      console.error('Stripe payment error:', error);
      return { success: false, error: error.message };
    }
  }

  async createCryptoPayment(userId, amount) {
    try {
      const paymentId = `PAY_${userId}_${Date.now()}`;
      
      const message = `
⚡ Оплата подписки ZeusVPN

💰 Сумма: 250 RUB (USDT по курсу)
💳 Адрес USDT (TRC20): ${process.env.CRYPTO_WALLET_ADDRESS}
🔑 ID платежа: ${paymentId}

📝 Инструкция:
1. Отправьте USDT на указанный адрес
2. Сделайте скриншот успешной транзакции
3. Отправьте скриншот с ID платежа в описании

⚠️ Важно: 
- Используйте только сеть TRC20
- Укажите ID платежа при отправке скриншота
- Сумма должна быть эквивалентна 250 RUB

🔍 Статус платежа можно проверить командой:
/status ${paymentId}

❓ Нужна помощь? Напишите в поддержку:
/support
`;

      await telegramService.sendNotification(userId, message);
      
      await this.savePendingPayment(userId, paymentId, 250);

      return { 
        success: true, 
        message: 'Инструкции по оплате отправлены в бот',
        paymentId
      };
    } catch (error) {
      console.error('Crypto payment error:', error);
      return { success: false, error: error.message };
    }
  }

  async savePendingPayment(userId, paymentId, amount) {
    try {
      const user = await User.findOne({ where: { telegramId: userId } });
      if (!user) throw new Error('User not found');

      const pendingPayments = user.paymentHistory || [];
      pendingPayments.push({
        id: paymentId,
        amount,
        currency: 'RUB',
        status: 'pending',
        type: 'crypto',
        createdAt: new Date()
      });

      await User.update(
        { paymentHistory: pendingPayments },
        { where: { telegramId: userId } }
      );
    } catch (error) {
      console.error('Error saving pending payment:', error);
    }
  }

  async handleStripeWebhook(event) {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      await this.processSuccessfulPayment(session.metadata.userId);
    }
  }

  async processSuccessfulPayment(userId, amount) {
    try {
      const user = await User.findOne({ where: { telegramId: userId } });
      if (!user) throw new Error('User not found');

      // Обработка реферальной выплаты
      if (user.referredBy) {
        const referrer = await User.findOne({ where: { telegramId: user.referredBy } });
        if (referrer) {
          const referralAmount = Math.floor(amount * 0.3); // 30% от платежа
          await this.processReferralPayment(referrer.telegramId, referralAmount, userId);
        }
      }

      const currentDate = new Date();
      const newEndDate = user.subscriptionEndDate && user.subscriptionEndDate > currentDate
        ? new Date(user.subscriptionEndDate.getTime() + 30 * 24 * 60 * 60 * 1000)
        : new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      await User.update(
        {
          subscriptionEndDate: newEndDate,
          isActive: true,
          paymentHistory: [
            ...user.paymentHistory,
            {
              date: new Date(),
              amount,
              currency: 'RUB',
              type: 'subscription',
              status: 'completed'
            }
          ]
        },
        { where: { telegramId: userId } }
      );

      await telegramService.sendNotification(userId, `
⚡ Оплата успешно получена!

✅ Ваша подписка ZeusVPN активирована
📅 Действует до: ${newEndDate.toLocaleDateString()}

🚀 Теперь вы можете:
- Подключаться к любым серверам
- Использовать максимальную скорость
- Получать приоритетную поддержку

Приятного использования! ⚡
      `);

      return true;
    } catch (error) {
      console.error('Error processing payment:', error);
      return false;
    }
  }

  async processReferralPayment(referrerId, amount, referredUserId) {
    try {
      const referrer = await User.findOne({ where: { telegramId: referrerId } });
      if (!referrer) throw new Error('Referrer not found');

      // Обновляем статистику рефералов
      await User.update(
        {
          referralEarnings: (referrer.referralEarnings || 0) + amount,
          paymentHistory: [
            ...referrer.paymentHistory,
            {
              date: new Date(),
              amount,
              currency: 'RUB',
              type: 'referral',
              status: 'completed',
              referredUser: referredUserId
            }
          ]
        },
        { where: { telegramId: referrerId } }
      );

      // Отправляем уведомление о реферальном вознаграждении
      await telegramService.sendNotification(referrerId, `
🎉 Реферальное вознаграждение!

💰 Вы получили ${amount}₽ за оплату от приглашенного пользователя
💫 Продолжайте приглашать друзей и зарабатывайте 30% с каждого платежа!

⚡ ZeusVPN - ваш надежный партнер
      `);

    } catch (error) {
      console.error('Error processing referral payment:', error);
    }
  }

  async checkPaymentStatus(paymentId) {
    try {
      const user = await User.findOne({
        where: {
          paymentHistory: {
            [Op.contains]: [{id: paymentId}]
          }
        }
      });

      if (!user) return { success: false, error: 'Payment not found' };

      const payment = user.paymentHistory.find(p => p.id === paymentId);
      
      return {
        success: true,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        date: payment.createdAt
      };
    } catch (error) {
      console.error('Error checking payment status:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new PaymentService(); 