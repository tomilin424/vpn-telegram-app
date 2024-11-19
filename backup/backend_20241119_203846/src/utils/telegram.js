const crypto = require('crypto');

function verifyTelegramWebAppData(initData) {
  try {
    // Разбираем строку initData
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    params.delete('hash');

    // Сортируем параметры
    const paramsList = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Создаем HMAC
    const secret = crypto.createHmac('sha256', 'WebAppData')
      .update(process.env.BOT_TOKEN)
      .digest();

    const calculatedHash = crypto.createHmac('sha256', secret)
      .update(paramsList)
      .digest('hex');

    return calculatedHash === hash;
  } catch (error) {
    console.error('Ошибка при проверке данных Telegram Web App:', error);
    return false;
  }
}

module.exports = {
  verifyTelegramWebAppData
}; 