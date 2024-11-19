require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const paymentWebhookRouter = require('./routes/paymentWebhook');
const paymentRoutes = require('./routes/paymentRoutes');
const paymentPage = require('./routes/paymentPage');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', paymentWebhookRouter);
app.use('/api', paymentRoutes);
app.use('/', paymentPage);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Что-то пошло не так!');
});

const PORT = process.env.PORT || 3003;

// Запускаем без HTTPS для тестирования
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Bot token:', process.env.BOT_TOKEN); // Для отладки
}); 