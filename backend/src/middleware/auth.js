const crypto = require('crypto');

function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Отсутствует токен авторизации' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Received token:', token); // Для отладки

    // Извлекаем параметры из initData
    const params = new URLSearchParams(token);
    const userDataStr = params.get('user');
    console.log('User data string:', userDataStr); // Для отладки

    if (!userDataStr) {
      return res.status(401).json({ message: 'Отсутствуют данные пользователя' });
    }

    try {
      const userData = JSON.parse(decodeURIComponent(userDataStr));
      console.log('Parsed user data:', userData); // Для отладки

      if (!userData.id) {
        return res.status(401).json({ message: 'Отсутствует ID пользователя' });
      }

      req.user = {
        telegramId: userData.id,
        username: userData.username
      };

      next();
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return res.status(401).json({ message: 'Ошибка при разборе данных пользователя' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Ошибка авторизации' });
  }
}

module.exports = auth; 