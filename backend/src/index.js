require('dotenv').config();
const express = require('express');
const cors = require('cors');
const subscriptionRoutes = require('./routes/subscription');
const bot = require('./bot');

const app = express();

app.use(cors());
app.use(express.json());

// Маршруты
app.use('/api/subscription', subscriptionRoutes);

// Запуск бота
bot.launch();

// Запуск сервера
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

// Обработка выхода
process.once('SIGINT', () => bot.bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.bot.stop('SIGTERM')); 