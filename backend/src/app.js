require('dotenv').config();
const express = require('express');
const cors = require('cors');
const vpnRoutes = require('./routes/vpn');
const telegramService = require('./services/telegramService');

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Подключаем маршруты
app.use('/api/vpn', vpnRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('Telegram bot is active');
});

module.exports = app; 