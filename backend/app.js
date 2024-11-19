require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const app = express();
const paymentWebhookRouter = require('./routes/paymentWebhook');
const paymentRoutes = require('./routes/paymentRoutes');
const paymentPage = require('./routes/paymentPage');
const { bot } = require('./bot');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логирование запросов
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api', paymentWebhookRouter);
app.use('/api', paymentRoutes);
app.use('/', paymentPage);

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send('Что-то пошло не так!');
});

const PORT = process.env.PORT || 3003;

// Запускаем сервер
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Environment:', {
        OUTLINE_API_URL: process.env.OUTLINE_API_URL,
        BOT_TOKEN: 'Configured: ' + !!process.env.BOT_TOKEN,
        PAYSTO_SHOP_ID: process.env.PAYSTO_SHOP_ID
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    bot.stop('SIGTERM');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    bot.stop('SIGINT');
    process.exit(0);
}); 