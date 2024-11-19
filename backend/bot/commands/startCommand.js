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

        // Главное меню
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

    // Обработчик кнопки покупки
    bot.hears('🎣 Купить ZeusVPN - 100₽/месяц', async (ctx) => {
        await ctx.reply(
            '🎣 Оформление подписки ZeusVPN\n\n' +
            '🎁 Что входит в подписку:\n' +
            '🚀 Безлимитный трафик\n' +
            '⚡️ Высокая скорость\n' +
            '📱 Доступ со всех устройств\n' +
            '🛡 Надежная защита\n' +
            '🌿 Техническая поддержка\n\n' +
            '💎 Стоимость: 100₽/месяц\n\n' +
            '💳 Способы оплаты:\n' +
            '• Банковская карта\n' +
            '• Крипта',
            Markup.keyboard([
                ['💳 Оплатить картой'],
                ['🪙 Оплатить криптой'],
                ['◀️ Назад в меню']
            ]).resize()
        );
    });

    // Обработчик кнопки "Мои ключи"
    bot.hears('📦 Мои ключи', async (ctx) => {
        const userId = ctx.from.id;
        // Здесь нужно добавить проверку ключей пользователя в базе данных
        await ctx.reply(
            '📦 Ваши активные ключи:\n\n' +
            'У вас пока нет активных ключей.\n' +
            'Для получения ключа нажмите "Купить ZeusVPN"',
            Markup.keyboard([
                ['🎣 Купить ZeusVPN - 100₽/месяц'],
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
    const osInstructions = {
        '📱 Android': `
1. Установите приложение Outline:
• Откройте Google Play Store: https://play.google.com/store/apps/details?id=org.outline.android.client
• Или скачайте напрямую с сайта: https://getoutline.org/get-started/#step-3

2. После установки:
• Откройте приложение
• Нажмите "Добавить сервер"
• Вставьте полученный ключ доступа
• Нажмите "Подключиться"

3. Готово! Ваш VPN подключен`,

        '🍎 iOS/iPhone': `
1. Установите приложение Outline:
• Откройте App Store: https://apps.apple.com/app/outline-app/id1356177741
• Или скачайте через сайт: https://getoutline.org/get-started/#step-3

2. После установки:
• Откройте приложение
• Нажмите "Добавить сервер"
• Вставьте полученный ключ доступа
• Разрешите установку VPN профиля
• Нажмите "Подключиться"

3. Готово! Ваш VPN подключен`,

        '🪟 Windows': `
1. Скачайте Outline Client:
• Скачайте установщик: https://raw.githubusercontent.com/Jigsaw-Code/outline-releases/master/client/stable/Outline-Client.exe
• Или через сайт: https://getoutline.org/get-started/#step-3

2. Установка:
• Запустите скачанный файл
• Следуйте инструкциям установщика
• Дождитесь завершения установки

3. Настройка:
• Запустите Outline Client
• Нажмите "Add server"
• Вставьте полученный ключ доступа
• Нажмите "Connect"

4. Готово! Ваш VPN подключен`,

        '🐧 Linux': `
1. Скачайте Outline Client:
• Скачайте AppImage: https://raw.githubusercontent.com/Jigsaw-Code/outline-releases/master/client/stable/Outline-Client.AppImage
• Или через сайт: https://getoutline.org/get-started/#step-3

2. Установка:
• Откройте терминал
• Сделайте файл исполняемым:
  chmod +x Outline-Client.AppImage
• Запустите приложение:
  ./Outline-Client.AppImage

3. Настройка:
• Нажмите "Add server"
• Вставьте полученный ключ доступа
• Нажмите "Connect"

4. Готово! Ваш VPN подключен`,

        '🍏 macOS': `
1. Скачайте Outline Client:
• Скачайте DMG файл: https://raw.githubusercontent.com/Jigsaw-Code/outline-releases/master/client/stable/Outline-Client.dmg
• Или через сайт: https://getoutline.org/get-started/#step-3

2. Установка:
• Откройте скачанный .dmg файл
• Перетащите Outline в папку Applications
• Запустите приложение

3. Настройка:
• Нажмите "Add server"
• Вставьте полученный ключ доступа
• Разрешите установку VPN конфигурации
• Нажмите "Connect"

4. Готово! Ваш VPN подключен`
    };

    Object.entries(osInstructions).forEach(([os, instruction]) => {
        bot.hears(os, async (ctx) => {
            await ctx.reply(instruction, Markup.keyboard([
                ['◀️ Назад в меню']
            ]).resize());
        });
    });

    // Обработчик кнопки "Назад в меню"
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