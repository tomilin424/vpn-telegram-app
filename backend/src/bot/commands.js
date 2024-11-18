const { Telegraf, Markup } = require('telegraf');
const PaymentService = require('../services/paymentService');
const PaymentProcessor = require('../services/paymentProcessor');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Обработчик команды /start
bot.command('start', (ctx) => {
  try {
    ctx.reply(
      'Добро пожаловать в VPN Service! 🚀\n\n' +
      'Для начала работы нажмите кнопку меню ниже ⬇️',
      Markup.keyboard([
        [Markup.button.webApp('Открыть VPN App', 'https://vpn-telegram-app.vercel.app')]
      ]).resize()
    );
  } catch (error) {
    console.error('Ошибка при обработке команды /start:', error);
    ctx.reply('Произошла ошибка. Попробуйте позже.');
  }
});

// Обработчик команды /help
bot.help((ctx) => {
  ctx.reply(
    'Как использовать VPN Service:\n\n' +
    '1. Нажмите на кнопку меню внизу\n' +
    '2. Оформите подписку\n' +
    '3. Подключите VPN'
  );
});

// Обработка ошибок
bot.catch((err, ctx) => {
  console.error('Ошибка бота:', err);
  ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
});

// Обработка команды /subscribe
bot.command('subscribe', async (ctx) => {
  try {
    // Отправляем информацию о тестовой оплате
    await ctx.reply(
      '🔄 Тестовый режим оплаты\n\n' +
      'Для тестирования используйте следующие данные:\n' +
      '💳 Карта: 4242 4242 4242 4242\n' +
      '📅 Срок действия: любой будущий\n' +
      '🔒 CVV: любые 3 цифры\n' +
      '👤 Имя: любое\n' +
      '📧 Email: любой\n' +
      '📱 Телефон: любой'
    );

    const invoice = await PaymentProcessor.processPayment({
      telegramId: ctx.from.id,
      amount: 250,
      subscriptionType: 1
    });
    
    await ctx.replyWithInvoice(invoice);
  } catch (error) {
    console.error('Ошибка при создании платежа:', error);
    ctx.reply('Произошла ошибка при создании платежа. Попробуйте позже.');
  }
});

// Обработка pre-checkout query
bot.on('pre_checkout_query', (ctx) => {
  // Всегда подтверждаем тестовый платеж
  return ctx.answerPreCheckoutQuery(true);
});

// Обработка успешной оплаты
bot.on('successful_payment', async (ctx) => {
  try {
    const { successful_payment } = ctx.message;
    const payload = JSON.parse(successful_payment.invoice_payload);
    
    await PaymentProcessor.activateSubscription(
      ctx.from.id,
      payload.subscriptionType
    );

    await ctx.reply(
      '✅ Тестовый платеж успешно выполнен!\n\n' +
      'Ваша подписка активирована.\n' +
      'Теперь вы можете подключить VPN в приложении.'
    );
  } catch (error) {
    console.error('Ошибка при обработке успешного платежа:', error);
    ctx.reply('Произошла ошибка при активации подписки. Пожалуйста, обратитесь в поддержку.');
  }
});

module.exports = bot; 