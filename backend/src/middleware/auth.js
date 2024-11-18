const crypto = require('crypto');

function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Отсутствует токен авторизации' });
    }

    const token = authHeader.split(' ')[1];
    const initData = decodeInitData(token);
    
    if (!initData || !initData.user) {
      return res.status(401).json({ message: 'Недействительный токен' });
    }

    req.user = {
      telegramId: initData.user.id,
      username: initData.user.username
    };

    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Ошибка авторизации' });
  }
}

function decodeInitData(initData) {
  // Здесь должна быть валидация initData от Telegram
  // https://core.telegram.org/bots/webapps#validating-data-received-via-the-web-app
  
  const data = new URLSearchParams(initData);
  return JSON.parse(data.get('user') || '{}');
}

module.exports = auth; 