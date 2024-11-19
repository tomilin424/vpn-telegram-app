const { Markup } = require('telegraf');

module.exports = (bot) => {
    bot.command('start', async (ctx) => {
        const param = ctx.message.text.split(' ')[1];
        
        if (param?.startsWith('crypto_success_')) {
            const userId = param.split('_')[2];
            if (ctx.from.id.toString() === userId) {
                await ctx.reply('Спасибо за оплату криптовалютой! Ваш VPN ключ будет отправлен в течение минуты.');
                return;
            }
        }
        
        if (param === 'payment_success') {
            await ctx.reply('Спасибо за оплату! Ожидайте получения VPN ключа.');
            return;
        }
        
        if (param === 'payment_fail') {
            await ctx.reply('К сожалению, оплата не прошла. Пожалуйста, попробуйте снова или обратитесь в поддержку.');
            return;
        }

        // Приветственное сообщение как на скриншоте
        await ctx.reply(
            '🎣 Оформление подписки ZeusVPN\n\n' +
            '🎁 Что входит в подписку:\n' +
            '🚀 Безлимитный трафик\n' +
            '⚡ Высокая скорость\n' +
            '📱 Доступ со всех устройств\n' +
            '🛡 Надежная защита\n' +
            '🌿 Техническая поддержка\n\n' +
            '💎 Стоимость: 100₽/месяц\n\n' +
            '💳 Способы оплаты:\n' +
            '• Банковская карта\n' +
            '• СБП\n' +
            '• ЮMoney',
            Markup.keyboard([
                ['💳 Оплатить картой'],
                ['🏦 Оплатить через СБП'],
                ['💰 Оплатить через ЮMoney'],
                ['◀️ Назад в меню']
            ]).resize()
        );
    });

    // Обработчик кнопки "Инструкция по установке"
    bot.hears('📖 Инструкция по установке', async (ctx) => {
        await ctx.reply(
            '📖 Выберите вашу операционную систему\nдля получения инструкций по установке:',
            Markup.keyboard([
                ['📱 Android'],
                ['🍎 iOS/iPhone'],
                ['🪟 Windows'],
                ['🐧 Linux'],
                ['🍏 macOS'],
                ['◀️ Назад в меню']
            ]).resize()
        );
    });

    // Обработчики для каждой ОС
    bot.hears('📱 Android', async (ctx) => {
        await ctx.reply('Инструкция для Android...');
        // Отправка инструкции для Android
    });

    bot.hears('🍎 iOS/iPhone', async (ctx) => {
        await ctx.reply('Инструкция для iOS...');
        // Отправка инструкции для iOS
    });

    // ... аналогично для других ОС

    // Обработчик кнопки "Получить ключ"
    bot.hears('🔑 Получить ключ', async (ctx) => {
        // Здесь логика получения ключа
        await ctx.reply(
            '🔑 Ваш ключ доступа готов!\n\n' +
            'Скопируйте его и вставьте в приложение Outline:\n\n' +
            'ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTpwYXNzd29yZA@example.com:3000/?outline=1'
        );
    });

    // Обработчик кнопки "Назад в меню"
    bot.hears('◀️ Назад в меню', async (ctx) => {
        await ctx.reply(
            '🌟 Главное меню',
            Markup.keyboard([
                ['🎣 Купить ZeusVPN - 100₽/месяц'],
                ['📖 Инструкция по установке'],
                ['📦 Мои ключи']
            ]).resize()
        );
    });

    // Обработчик для платежных методов
    ['💳 Оплатить картой', '🏦 Оплатить через СБП', '💰 Оплатить через ЮMoney'].forEach(method => {
        bot.hears(method, async (ctx) => {
            // Здесь логика для каждого метода оплаты
            const orderId = `ORDER_${Date.now()}_${ctx.from.id}`;
            // ... обработка оплаты
        });
    });
}; 