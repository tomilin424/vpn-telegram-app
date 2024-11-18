const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);
const User = require('../models/user');

class TelegramService {
  constructor() {
    this.initializeBot();
  }

  initializeBot() {
    // Обработка команды /start
    bot.command('start', (ctx) => {
      ctx.reply('Добро пожаловать в ZeusVPN! ⚡\n\nВаш надежный VPN-сервис с молниеносной скоростью.\n\nИспользуйте кнопки ниже для управления:');
    });

    // Обработка команды /help
    bot.command('help', (ctx) => {
      ctx.reply(`🔧 Помощь по использованию ZeusVPN:

1. Оформление подписки:
   - Нажмите "Подписаться"
   - Выберите способ оплаты
   - Следуйте инструкциям

2. Подключение:
   - После оплаты нажмите "Подключиться"
   - Выберите сервер
   - Готово!

3. Поддержка:
   Если у вас возникли вопросы, напишите /support

⚡ Приятного использования!`);
    });

    // Обработка команды /support
    bot.command('support', (ctx) => {
      ctx.reply('Для связи с поддержкой напишите: @support_zeus_vpn');
    });

    // Обработка фото (скриншотов оплаты)
    bot.on('photo', async (ctx) => {
      const caption = ctx.message.caption;
      if (!caption || !caption.includes('PAY_')) {
        ctx.reply('Пожалуйста, отправьте скриншот с ID платежа в описании.');
        return;
      }

      const paymentId = caption.match(/PAY_\d+_\d+/)[0];
      const userId = ctx.from.id;

      try {
        const user = await User.findOne({ 
          where: { telegramId: userId },
          raw: true 
        });

        const payment = user.paymentHistory.find(p => p.id === paymentId && p.status === 'pending');
        
        if (!payment) {
          ctx.reply('Платёж не найден или уже обработан.');
          return;
        }

        // Отправляем уведомление администратору
        await bot.telegram.sendPhoto(
          process.env.ADMIN_CHAT_ID,
          ctx.message.photo[ctx.message.photo.length - 1].file_id,
          {
            caption: `
⚡ Новый платеж ZeusVPN

👤 User ID: ${userId}
👤 Username: @${ctx.from.username || 'нет'}
💰 Сумма: ${payment.amount} USDT
🔑 Payment ID: ${paymentId}

Для подтверждения:
/confirm ${paymentId}

Для отклонения:
/reject ${paymentId}
            `
          }
        );

        ctx.reply('Спасибо! Ваш платёж находится на проверке. Мы уведомим вас о результате в течение нескольких минут.');
      } catch (error) {
        console.error('Error processing payment confirmation:', error);
        ctx.reply('Произошла ошибка при обработке платежа. Пожалуйста, обратитесь в поддержку: @support_zeus_vpn');
      }
    });

    // Команды для администратора
    bot.command('confirm', async (ctx) => {
      if (ctx.from.id.toString() !== process.env.ADMIN_CHAT_ID) return;

      const paymentId = ctx.message.text.split(' ')[1];
      if (!paymentId) return;

      const userId = paymentId.split('_')[1];
      await this.processSuccessfulPayment(userId);
      ctx.reply('✅ Платёж подтверждён');
    });

    bot.command('reject', async (ctx) => {
      if (ctx.from.id.toString() !== process.env.ADMIN_CHAT_ID) return;

      const paymentId = ctx.message.text.split(' ')[1];
      if (!paymentId) return;

      const userId = paymentId.split('_')[1];
      await this.rejectPayment(userId, paymentId);
      ctx.reply('❌ Платёж отклонён');
    });

    // Запуск бота
    bot.launch();

    // Включаем graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  }

  async sendNotification(userId, message) {
    try {
      await bot.telegram.sendMessage(userId, message);
      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }

  async processSuccessfulPayment(userId) {
    try {
      const user = await User.findOne({ where: { telegramId: userId } });
      if (!user) throw new Error('User not found');

      const currentDate = new Date();
      const newEndDate = user.subscriptionEndDate && user.subscriptionEndDate > currentDate
        ? new Date(user.subscriptionEndDate.getTime() + 30 * 24 * 60 * 60 * 1000)
        : new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      await User.update(
        {
          subscriptionEndDate: newEndDate,
          isActive: true
        },
        { where: { telegramId: userId } }
      );

      await this.sendNotification(userId, `
✅ Платёж подтверждён!

⚡ Ваша подписка ZeusVPN активирована
📅 Действует до: ${newEndDate.toLocaleDateString()}

Приятного использования! 🚀
      `);
    } catch (error) {
      console.error('Error processing payment:', error);
      await this.sendNotification(userId, 'Произошла ошибка при активации подписки. Пожалуйста, обратитесь в поддержку: @support_zeus_vpn');
    }
  }

  async rejectPayment(userId, paymentId) {
    try {
      const user = await User.findOne({ where: { telegramId: userId } });
      if (!user) throw new Error('User not found');

      const paymentHistory = user.paymentHistory.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: 'rejected' }
          : payment
      );

      await User.update(
        { paymentHistory },
        { where: { telegramId: userId } }
      );

      await this.sendNotification(userId, `
❌ Платёж отклонён

Возможные причины:
- Неверная сумма перевода
- Отсутствие подтверждения транзакции
- Использование неподдерживаемой сети

Пожалуйста, проверьте детали и попробуйте снова или обратитесь в поддержку: @support_zeus_vpn
      `);
    } catch (error) {
      console.error('Error rejecting payment:', error);
    }
  }
}

module.exports = new TelegramService(); 