require('dotenv').config();
const express = require('express');
const { setupSecurity, checkIP } = require('./middleware/security');
const telegramService = require('./services/telegramService');

const app = express();
const port = process.env.PORT || 3003;

// Применяем защиту
setupSecurity(app);

app.use(express.json());

// Защита API endpoints
app.use('/api', checkIP);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('Telegram bot is active with security measures');
});

module.exports = app; 