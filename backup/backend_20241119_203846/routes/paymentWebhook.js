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

                // Создаем VPN ключ
                const vpnKey = await vpnService.createVPNKey();

                // Получаем ID пользователя из ORDER_ID
                const userId = ORDER_ID.split('_')[2];

                // Отправляем ключ пользователю
                await bot.telegram.sendMessage(userId, 
                    `Спасибо за оплату! Ваш VPN ключ:\n\n${vpnKey}\n\nИспользуйте его для подключения к VPN.`
                );

                res.status(200).send('OK');
            } catch (error) {
                console.error('Error processing successful payment:', error);
                res.status(500).send('Error processing payment');
            }
        } else {
            // Обновляем статус заказа на failed если оплата не прошла
            await orderService.updateOrder(ORDER_ID, 'failed');
            res.status(200).send('OK');
        }
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router; 