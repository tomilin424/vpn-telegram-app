require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const apiRoutes = require('./routes/api');
const referralRoutes = require('./routes/referral');
const telegramService = require('./services/telegramService');
const notificationService = require('./services/notificationService');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/referral', referralRoutes);

// Database sync
sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

// Start notification service
notificationService.startDailyCheck();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('BOT_TOKEN:', process.env.BOT_TOKEN);
}); 