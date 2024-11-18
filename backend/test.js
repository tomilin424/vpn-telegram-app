require('dotenv').config();
const vpnService = require('./src/services/vpnService');
const User = require('./src/models/User');
const sequelize = require('./src/config/sequelize');

async function testVPNService() {
  try {
    // Ждем синхронизации базы данных
    await sequelize.sync({ force: true });
    console.log('База данных синхронизирована');

    // Проверяем наличие необходимых переменных окружения
    if (!process.env.OUTLINE_API_URL || !process.env.OUTLINE_API_KEY) {
      throw new Error('Отсутствуют необходимые переменные окружения OUTLINE_API_URL или OUTLINE_API_KEY');
    }

    // Создаем тестового пользователя
    const testUserId = '241316555';
    const [user, created] = await User.findOrCreate({
      where: { telegramId: testUserId },
      defaults: {
        username: 'test_user',
        isActive: false
      }
    });
    console.log('Пользователь создан:', created);
    
    console.log('Проверяем переменные окружения:');
    console.log('OUTLINE_API_URL:', process.env.OUTLINE_API_URL);
    console.log('OUTLINE_API_KEY:', process.env.OUTLINE_API_KEY);
    
    console.log('\nСоздаем конфигурацию...');
    const config = await vpnService.createConfig(testUserId);
    console.log('Результат создания:', config);
    
    if (config.success) {
      console.log('\nПроверяем статус...');
      const status = await vpnService.getStatus(testUserId);
      console.log('Статус:', status);
      
      console.log('\nУдаляем конфигурацию...');
      const deleteResult = await vpnService.deleteConfig(testUserId);
      console.log('Результат удаления:', deleteResult);
    }
  } catch (error) {
    console.error('Ошибка при тестировании:', error);
    console.error('Stack:', error.stack);
  } finally {
    // Закрываем соединение с базой данных
    await sequelize.close();
  }
}

// Запускаем тест
console.log('Начинаем тестирование VPN сервиса...\n');
testVPNService(); 