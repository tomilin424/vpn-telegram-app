const { Markup } = require('telegraf');
const { handlePayment, handleCardPayment, handleCryptoPayment } = require('../handlers/paymentHandler');

module.exports = (bot) => {
    // Команда покупки
    bot.command('buy_vpn', handlePayment);
    bot.hears('🎣 Купить ZeusVPN - 100₽/месяц', handlePayment);
    
    // Обработчики способов оплаты
    bot.hears('💳 Оплатить картой', handleCardPayment);
    bot.hears('🪙 Оплатить криптой', handleCryptoPayment);
    
    // Обработчик возврата в меню
    bot.hears('◀️ Назад в меню', async (ctx) => {
        await ctx.reply(
            '⚡ Добро пожаловать в ZeusVPN!\n\n' +
            '🌟 Что умеет наш VPN:\n' +
            '🚀 Быстрый и надежный VPN-доступ\n' +
            '📱 Работает на всех устройствах\n' +
            '∞ Безлимитный трафик\n' +
            '⚡ Высокая скорость\n\n' +
            '💎 Стоимость: всего 100₽ в месяц\n\n' +
            '🌿 Нажмите "Купить ZeusVPN" для оформления подписки',
            Markup.keyboard([
                ['🎣 Купить ZeusVPN - 100₽/месяц'],
                ['📖 Инструкция по установке'],
                ['📦 Мои ключи']
            ]).resize()
        );
    });
}; 