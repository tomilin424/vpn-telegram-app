const express = require('express');
const router = express.Router();
const vpnService = require('../services/vpnService');

router.get('/payment/success', async (req, res) => {
    try {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Успешная оплата</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        padding: 20px;
                    }
                    .success-message {
                        color: #28a745;
                        font-size: 24px;
                        margin: 20px 0;
                    }
                    .instruction {
                        font-size: 18px;
                        margin: 20px 0;
                    }
                </style>
            </head>
            <body>
                <div class="success-message">✅ Оплата прошла успешно!</div>
                <div class="instruction">
                    Вернитесь в Telegram бот для получения VPN ключа
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Success page error:', error);
        res.status(500).send('Произошла ошибка');
    }
});

router.get('/payment/fail', async (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Ошибка оплаты</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 20px;
                }
                .error-message {
                    color: #dc3545;
                    font-size: 24px;
                    margin: 20px 0;
                }
                .instruction {
                    font-size: 18px;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="error-message">❌ Ошибка оплаты</div>
            <div class="instruction">
                Вернитесь в Telegram бот и попробуйте снова
            </div>
        </body>
        </html>
    `);
});

module.exports = router; 