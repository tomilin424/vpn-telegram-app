const express = require('express');
const router = express.Router();
const paystoService = require('../services/paystoService');
const orderService = require('../services/orderService');
const vpnService = require('../services/vpnService');
const { bot } = require('../bot');

router.post('/payment/webhook', async (req, res) => {
    try {
        const payload = req.body;

        if (!paystoService.verifyPayment(payload)) {
            return res.status(400).send('Invalid signature');
        }

        const { ORDER_ID, STATUS } = payload;

        if (STATUS === 'SUCCESS') {
            try {
                // Обновляем статус заказа
                await orderService.updateOrder(ORDER_ID, 'completed');

                // Получаем ID пользователя из ORDER_ID
                const userId = ORDER_ID.split('_')[2];

                try {
                    // Создаем VPN ключ с привязкой к пользователю
                    const vpnKey = await vpnService.createVPNKey(userId);

                    // Отправляем ключ пользователю
                    await bot.telegram.sendMessage(userId, 
                        '🎉 Спасибо за оплату!\n\n' +
                        '🔑 Ваш VPN ключ готов:\n\n' +
                        `<code>${vpnKey}</code>\n\n` +
                        '📱 Этот ключ можно использовать на 3 устройствах\n' +
                        '⚠️ Не передавайте ключ третьим лицам\n\n' +
                        '📖 Инструкции по установке доступны в главном меню',
                        { parse_mode: 'HTML' }
                    );
                } catch (vpnError) {
                    if (vpnError.message.includes('Достигнут лимит устройств')) {
                        await bot.telegram.sendMessage(userId,
                            '⚠️ Достигнут лимит устройств (максимум 3)\n' +
                            'Пожалуйста, удалите неиспользуемые устройства перед добавлением новых.'
                        );
                    } else {
                        throw vpnError;
                    }
                }

                res.status(200).send('OK');
            } catch (error) {
                console.error('Error processing successful payment:', error);
                res.status(500).send('Error processing payment');
            }
        } else {
            await orderService.updateOrder(ORDER_ID, 'failed');
            res.status(200).send('OK');
        }
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router; 