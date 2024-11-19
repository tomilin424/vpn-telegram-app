const express = require('express');
const router = express.Router();

// Обработчик для главной страницы
router.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Zeus VPN Payment</title>
        </head>
        <body>
            <span class='mrtplceinfo'>Товары и услуги реализуются совместно с plentr<!-- fromshop=26090 verification--></span>
        </body>
        </html>
    `);
});

// Существующий обработчик для /payment остается без изменений
router.get('/payment', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Оплата VPN</title>
        </head>
        <body>
            <div id="payment-container">
                <!-- Здесь будет форма оплаты -->
            </div>
        </body>
        </html>
    `);
});

module.exports = router; 