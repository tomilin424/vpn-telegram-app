const { Markup } = require('telegraf');
const { handlePayment, handleCardPayment, handleSBPPayment, handleYooMoneyPayment, handleInstructions } = require('../handlers/paymentHandler');

module.exports = (bot) => {
    // Команда покупки
    bot.command('buy_vpn', handlePayment);
    bot.hears('🎣 Купить ZeusVPN - 100₽/месяц', handlePayment);
    
    // Обработчики способов оплаты
    bot.hears('💳 Оплатить картой', handleCardPayment);
    bot.hears('🏦 Оплатить через СБП', handleSBPPayment);
    bot.hears('💰 Оплатить через ЮMoney', handleYooMoneyPayment);
    
    // Обработчики инструкций
    bot.hears('📱 Android', ctx => handleInstructions(ctx, 'Android'));
    bot.hears('🍎 iOS/iPhone', ctx => handleInstructions(ctx, 'iOS'));
    bot.hears('🪟 Windows', ctx => handleInstructions(ctx, 'Windows'));
    bot.hears('🐧 Linux', ctx => handleInstructions(ctx, 'Linux'));
    bot.hears('🍏 macOS', ctx => handleInstructions(ctx, 'macOS'));
    
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

    // Обработчик кнопки "Мои ключи"
    bot.hears('📦 Мои ключи', async (ctx) => {
        // Здесь должна быть логика получения ключей пользователя из базы данных
        await ctx.reply(
            'У вас пока нет активных ключей.\n' +
            'Для получения ключа нажмите "Купить ZeusVPN"'
        );
    });
}; 