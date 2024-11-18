const crypto = require('crypto');

const authMiddleware = (req, res, next) => {
  try {
    const initData = req.headers['x-telegram-init-data'];
    if (!initData) {
      return res.status(401).json({ error: 'Unauthorized: No init data' });
    }

    // Получаем данные и хэш
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    // Сортируем параметры
    const params = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Проверяем подпись
    const secret = crypto.createHmac('sha256', 'WebAppData')
      .update(process.env.BOT_TOKEN)
      .digest();

    const checkHash = crypto.createHmac('sha256', secret)
      .update(params)
      .digest('hex');

    if (checkHash !== hash) {
      return res.status(401).json({ error: 'Unauthorized: Invalid hash' });
    }

    // Добавляем данные пользователя в request
    req.telegramUser = JSON.parse(urlParams.get('user'));
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = authMiddleware; 