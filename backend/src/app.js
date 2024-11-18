require('dotenv').config();
const express = require('express');
const cors = require('cors');
const vpnRoutes = require('./routes/vpn');

const app = express();

// Настройка CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Маршруты
app.use('/api/vpn', vpnRoutes);

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Что-то пошло не так!' });
});

module.exports = app; 