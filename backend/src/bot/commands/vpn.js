const { Markup } = require('telegraf');

module.exports = async (ctx) => {
  try {
    const userId = ctx.from.id;
    
    // Создаем кнопку для открытия Mini App
    const keyboard = Markup.keyboard([
      [{ 
        text: '🚀 Открыть VPN панель', 
        web_app: { 
          url: 'https://vpn-telegram-app1.vercel.app' 
        } 
      }]
    ]).resize();

    await ctx.reply(
      'Для управления VPN нажмите кнопку ниже 👇\n\n' +
      'В приложении вы сможете:\n' +
      '• Подключить VPN\n' +
      '• Отключить VPN\n' +
      '• Проверить статус подключения',
      keyboard
    );

  } catch (error) {
    console.error('Ошибка в команде VPN:', error);
    await ctx.reply('Произошла ошибка. Попробуйте позже.');
  }
}; 