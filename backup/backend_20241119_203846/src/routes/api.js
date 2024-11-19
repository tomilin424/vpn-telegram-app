const express = require('express');
const router = express.Router();
const vpnService = require('../services/vpnService');
const telegramService = require('../services/telegramService');
const paymentService = require('../services/paymentService');
const notificationService = require('../services/notificationService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const logger = require('../utils/logger');

// Middleware для проверки авторизации
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// Создание VPN конфигурации
router.post('/create-config', async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await vpnService.createConfig(userId);
    if (result.success) {
      await telegramService.sendNotification(userId, `
⚡ ZeusVPN: Конфигурация создана

✅ Ваша VPN конфигурация успешно создана!

🚀 Для подключения:
1. Скачайте конфигурационный файл
2. Импортируйте его в WireGuard
3. Нажмите "Подключиться"

❓ Нужна помощь? Напишите в поддержку:
/support
      `);
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error('Error creating VPN config:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Получение статуса VPN
router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const status = await vpnService.getStatus(userId);
    res.json(status);
  } catch (error) {
    logger.error('Error getting VPN status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Оплата криптовалютой
router.post('/payment/crypto', async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await paymentService.createCryptoPayment(userId, 250); // Фиксированная цена 250 рублей
    res.json(result);
  } catch (error) {
    logger.error('Error creating crypto payment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Оплата картой
router.post('/payment/card', async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await paymentService.createCardPayment(userId, 250); // Фиксированная цена 250 рублей
    res.json(result);
  } catch (error) {
    logger.error('Error creating card payment:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Webhook для Stripe
router.post('/webhook/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    await paymentService.handleStripeWebhook(event);
    logger.info('Stripe webhook processed successfully');
    res.json({received: true});
  } catch (error) {
    logger.error('Stripe webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// Проверка статуса платежа
router.get('/payment/status/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const status = await paymentService.checkPaymentStatus(paymentId);
    res.json(status);
  } catch (error) {
    logger.error('Error checking payment status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Отправка тестового уведомления (для отладки)
router.post('/test-notification', async (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    try {
      const { userId, type } = req.body;
      
      switch (type) {
        case 'welcome':
          await notificationService.sendWelcomeMessage(userId);
          break;
        case 'expiring':
          await telegramService.sendNotification(userId, `
⚡ ZeusVPN: Тестовое уведомление

⚠️ Ваша подписка истекает через 3 дня

💡 Для продления подписки:
1. Откройте приложение ZeusVPN
2. Нажмите "Подписаться"
3. Выберите удобный способ оплаты

🔥 Успейте продлить по текущей цене!
          `);
          break;
        default:
          throw new Error('Unknown notification type');
      }
      
      res.json({ success: true });
    } catch (error) {
      logger.error('Error sending test notification:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(403).json({ error: 'Test endpoints disabled in production' });
  }
});

module.exports = router; 