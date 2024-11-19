const User = require('../models/User');

class UserController {
  async getProfile(req, res) {
    try {
      const { telegramId } = req.user;
      const user = await User.findOne({ telegramId });

      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      res.json({
        subscription_active: user.subscription_active,
        subscription_end: user.subscription_end,
        telegram_id: user.telegram_id
      });
    } catch (error) {
      console.error('Ошибка при получении профиля:', error);
      res.status(500).json({ message: 'Ошибка при получении профиля' });
    }
  }

  async getStats(req, res) {
    try {
      const { telegramId } = req.user;
      const user = await User.findOne({ telegramId });

      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      // Получаем статистику использования
      const stats = {
        monthlyTraffic: await this.calculateMonthlyTraffic(telegramId),
        totalUptime: await this.calculateTotalUptime(telegramId),
        connections: await this.getConnectionHistory(telegramId)
      };

      res.json(stats);
    } catch (error) {
      console.error('Ошибка при получении статистики:', error);
      res.status(500).json({ message: 'Ошибка при получении статистики' });
    }
  }

  async calculateMonthlyTraffic(telegramId) {
    // Здесь должна быть реальная логика подсчета трафика
    return Math.floor(Math.random() * 50 * 1024 * 1024 * 1024); // Имитация: 0-50 GB
  }

  async calculateTotalUptime(telegramId) {
    // Здесь должна быть реальная логика подсчета времени использования
    return Math.floor(Math.random() * 24 * 30 * 60); // Имитация: до 30 дней в минутах
  }

  async getConnectionHistory(telegramId) {
    // Здесь должна быть реальная история подключений из базы данных
    const servers = ['Европа', 'США', 'Азия'];
    const history = [];
    
    // Генерируем тестовые данные
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      history.push({
        server: servers[Math.floor(Math.random() * servers.length)],
        timestamp: date.toISOString(),
        duration: Math.floor(Math.random() * 180) // 0-180 минут
      });
    }

    return history;
  }
}

module.exports = new UserController(); 