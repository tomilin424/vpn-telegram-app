const TelegramBot = require('node-telegram-bot-api');
const outlineService = require('./outlineService');

class TelegramService {
    constructor() {
        this.bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
        this.adminChatId = process.env.ADMIN_CHAT_ID;
        this.setupCommands();
    }

    setupCommands() {
        // Команда start для всех пользователей
        this.bot.onText(/\/start/, async (msg) => {
            const chatId = msg.chat.id;
            
            const keyboard = {
                inline_keyboard: [
                    [{ text: '💫 Купить ZeusVPN - 100₽/месяц', callback_data: 'buy_vpn' }],
                    [{ text: '📗 Инструкция по установке', callback_data: 'installation_guide' }],
                    [{ text: '🗂 Мои ключи', callback_data: 'mykeys' }]
                ]
            };
            
            await this.bot.sendMessage(chatId, 
                '⚡️ Добро пожаловать в ZeusVPN!\n\n' +
                '🌟 Что умеет наш VPN:\n' +
                '🚀 Быстрый и надежный VPN-доступ\n' +
                '📱 Работает на всех устройствах\n' +
                '♾ Безлимитный трафик\n' +
                '⚡️ Высокая скорость\n\n' +
                '💎 Стоимость: всего 100₽ в месяц\n\n' +
                '🌿 Нажмите "Купить ZeusVPN" для оформления подписки',
                { reply_markup: keyboard }
            );
        });

        // Обработка нажатий на кнопки
        this.bot.on('callback_query', async (query) => {
            const chatId = query.message.chat.id;
            
            switch(query.data) {
                case 'android':
                    await this.sendInstructions(chatId, 'android');
                    break;
                case 'ios':
                    await this.sendInstructions(chatId, 'ios');
                    break;
                case 'windows':
                    await this.sendInstructions(chatId, 'windows');
                    break;
                case 'linux':
                    await this.sendInstructions(chatId, 'linux');
                    break;
                case 'macos':
                    await this.sendInstructions(chatId, 'macos');
                    break;
                case 'getkey':
                    await this.handleGetKey(chatId);
                    break;
                case 'mykeys':
                    await this.handleMyKeys(chatId);
                    break;
                case 'payment':
                    await this.handlePayment(chatId);
                    break;
                case 'check_payment':
                    await this.checkPayment(chatId, query.message.message_id);
                    break;
                case 'buy_vpn':
                    await this.showPaymentOptions(chatId);
                    break;
                case 'installation_guide':
                    const guideKeyboard = {
                        inline_keyboard: [
                            [{ text: '📱 Android', callback_data: 'android' }],
                            [{ text: '🍎 iOS/iPhone', callback_data: 'ios' }],
                            [{ text: '🪟 Windows', callback_data: 'windows' }],
                            [{ text: '🐧 Linux', callback_data: 'linux' }],
                            [{ text: '🍏 macOS', callback_data: 'macos' }],
                            [{ text: '◀️ Назад в меню', callback_data: 'back' }]
                        ]
                    };
                    
                    await this.bot.editMessageText(
                        '📖 Выберите вашу операционную систему для получения инструкций по установке:',
                        {
                            chat_id: chatId,
                            message_id: query.message.message_id,
                            reply_markup: guideKeyboard
                        }
                    );
                    break;
                case 'back':
                    const mainKeyboard = {
                        inline_keyboard: [
                            [{ text: '💫 Купить ZeusVPN - 100₽/месяц', callback_data: 'buy_vpn' }],
                            [{ text: '📗 Инструкция по установке', callback_data: 'installation_guide' }],
                            [{ text: '🗂 Мои ключи', callback_data: 'mykeys' }]
                        ]
                    };
                    
                    await this.bot.editMessageText(
                        '⚡️ Добро пожаловать в ZeusVPN!\n\n' +
                        '🌟 Что умеет наш VPN:\n' +
                        '🚀 Быстрый и надежный VPN-доступ\n' +
                        '📱 Работает на всех устройствах\n' +
                        '♾ Безлимитный трафик\n' +
                        '⚡️ Высокая скорость\n\n' +
                        '💎 Стоимость: всего 100₽ в месяц\n\n' +
                        '🌿 Нажмите "Купить ZeusVPN" для оформления подписки',
                        {
                            chat_id: chatId,
                            message_id: query.message.message_id,
                            reply_markup: mainKeyboard
                        }
                    );
                    break;
            }
            
            await this.bot.answerCallbackQuery(query.id);
        });

        // Админские команды
        this.bot.onText(/\/admin/, async (msg) => {
            const chatId = msg.chat.id;
            if (chatId.toString() !== this.adminChatId) {
                await this.bot.sendMessage(chatId, 'У вас нет прав администратора.');
                return;
            }

            await this.bot.sendMessage(chatId,
                'Админ-панель:\n' +
                '/allkeys - Посмотреть все ключи\n' +
                '/deletekey <id> - Удалить ключ\n' +
                '/stats - Статистика использования'
            );
        });
    }

    async sendInstructions(chatId, platform) {
        const instructions = {
            android: {
                title: '📱 Инструкция для Android:',
                text: '1. Скачайте приложение Outline:\n' +
                      'https://play.google.com/store/apps/details?id=org.outline.android.client\n\n' +
                      '2. После установки нажмите кнопку "Получить ключ" ниже\n' +
                      '3. Скпируйте полученный ключ\n' +
                      '4. Откройте приложение Outline и вставьте ключ\n' +
                      '5. Нажмите "Подключиться"'
            },
            ios: {
                title: '🍎 Инструкция для iOS:',
                text: '1. Скачайте приложение Outline из App Store:\n' +
                      'https://apps.apple.com/app/outline-app/id1356177741\n\n' +
                      '2. После установки нажмите кнопку "Получить ключ" ниже\n' +
                      '3. Скопируйте полученный ключ\n' +
                      '4. Откройте приложение Outline и вставьте ключ\n' +
                      '5. Разрешите установку VPN-профиля'
            },
            windows: {
                title: '🪟 Инструкция для Windows:',
                text: '1. Скачайте установщик Outline:\n' +
                      'https://raw.githubusercontent.com/Jigsaw-Code/outline-releases/master/client/stable/Outline-Client.exe\n\n' +
                      '2. Установите приложение\n' +
                      '3. После установки нажмите кнопку "Получить ключ" ниже\n' +
                      '4. Скопируйте полученный ключ\n' +
                      '5. Откройте Outline и вставьте ключ\n' +
                      '6. Нажмите "Подключиться"'
            },
            linux: {
                title: '🐧 Инструкция для Linux:',
                text: '1. Скачайте AppImage:\n' +
                      'https://raw.githubusercontent.com/Jigsaw-Code/outline-releases/master/client/stable/Outline-Client.AppImage\n\n' +
                      '2. Сделайте файл исполняемым:\n' +
                      'chmod +x Outline-Client.AppImage\n\n' +
                      '3. Запустите приложение\n' +
                      '4. После запуска нажмите кнопку "Получить ключ" ниже\n' +
                      '5. Скопируйте полученный ключ\n' +
                      '6. Вставьте ключ в приложение'
            },
            macos: {
                title: '🍏 Инструкция для macOS:',
                text: '1. Скачайте приложение Outline:\n' +
                      'https://itunes.apple.com/app/outline-app/id1356178125\n\n' +
                      '2. Установите приложение\n' +
                      '3. После установки нажмите кнопку "Получить ключ" ниже\n' +
                      '4. Скопируйте полученный ключ\n' +
                      '5. Откройте Outline и вставьте ключ\n' +
                      '6. Разрешите установку VPN-профиля'
            }
        };

        const info = instructions[platform];
        const keyboard = {
            inline_keyboard: [
                [{ text: '🔑 Получить ключ', callback_data: 'getkey' }],
                [{ text: '◀️ Назад', callback_data: 'back' }]
            ]
        };

        await this.bot.sendMessage(chatId, 
            `${info.title}\n\n${info.text}`,
            { 
                reply_markup: keyboard,
                parse_mode: 'HTML',
                disable_web_page_preview: false
            }
        );
    }

    async handleGetKey(chatId) {
        try {
            const key = await outlineService.createKey(`user_${chatId}`);
            await this.bot.sendMessage(chatId,
                '🌟 Ваш ключ ZeusVPN готов!\n\n' +
                '📝 Скопируйте его и вставьте в приложение Outline:\n\n' +
                `<code>${key.accessUrl}</code>`,
                { 
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [[
                            { text: '◀️ Назад к инструкциям', callback_data: 'back' }
                        ]]
                    }
                }
            );
        } catch (error) {
            console.error('Error creating key:', error);
            await this.bot.sendMessage(chatId, 
                '❌ Произошла ошибка при создании ключа. Попробуйте позже.'
            );
        }
    }

    async handleMyKeys(chatId) {
        try {
            const allKeys = await outlineService.getAllKeys();
            const userKeys = allKeys.accessKeys.filter(key => key.name === `user_${chatId}`);
            
            if (userKeys.length === 0) {
                await this.bot.sendMessage(chatId, 
                    '🌿 У вас пока нет активных ключей.\n' +
                    '💫 Нажмите "Купить ZeusVPN", чтобы оформить подписку.',
                    {
                        reply_markup: {
                            inline_keyboard: [[
                                { text: '💫 Купить ZeusVPN', callback_data: 'buy_vpn' }
                            ]]
                        }
                    }
                );
                return;
            }

            let message = '🗂 Ваши активные ключи ZeusVPN:\n\n';
            userKeys.forEach((key, index) => {
                message += `${index + 1}. ID: ${key.id}\n`;
                message += `<code>${key.accessUrl}</code>\n\n`;
            });

            await this.bot.sendMessage(chatId, message, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [[
                        { text: '◀️ Назад', callback_data: 'back' }
                    ]]
                }
            });
        } catch (error) {
            console.error('Error getting keys:', error);
            await this.bot.sendMessage(chatId, 
                '❌ Произошла ошибка при получении списка ключей. Попробуйте позже.'
            );
        }
    }

    async handlePayment(chatId) {
        const paymentMessage = 
            '💳 Оплата VPN на 1 месяц\n\n' +
            '💰 Стоимость: 100₽\n\n' +
            '📝 Инструкция по оплате:\n' +
            '1. Переведите 100₽ на карту:\n' +
            '   2202 2024 3494 4403 (Сбербанк)\n\n' +
            '2. В комментарии к переводу укажите ваш ID:\n' +
            `   <code>${chatId}</code>\n\n` +
            '3. После оплаты нажмите кнопку "Проверить оплату"\n\n' +
            '❗️ Важно: перевод должен быть именно на 100₽ и содержать ваш ID в комментарии';

        const keyboard = {
            inline_keyboard: [
                [{ text: '✅ Проверить оплату', callback_data: 'check_payment' }],
                [{ text: '◀️ Назад', callback_data: 'back' }]
            ]
        };

        await this.bot.sendMessage(chatId, paymentMessage, {
            parse_mode: 'HTML',
            reply_markup: keyboard
        });
    }

    async checkPayment(chatId, messageId) {
        // В реальном проекте здесь должна быть проверка оплаты через API банка
        // Сейчас просто создаем ключ
        try {
            const key = await outlineService.createKey(`paid_user_${chatId}`);
            
            const successMessage = 
                '✅ Оплата успешно проверена!\n\n' +
                '🔑 Ваш VPN ключ:\n' +
                `<code>${key.accessUrl}</code>\n\n` +
                '📱 Установите приложение Outline и вставьте этот ключ\n' +
                '⏰ Ключ действителен 30 дней\n' +
                '❗️ Сохраните ключ, он может пригодиться';

            await this.bot.editMessageText(successMessage, {
                chat_id: chatId,
                message_id: messageId,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [[
                        { text: '◀️ Вернуться в меню', callback_data: 'back' }
                    ]]
                }
            });
        } catch (error) {
            console.error('Error in payment processing:', error);
            
            const errorMessage = 
                '❌ Ошибка при проверке оплаты\n\n' +
                'Возможные причины:\n' +
                '• Платеж еще не поступил\n' +
                '• В комментарии не указан ID\n' +
                '• Неверная сумма перевода\n\n' +
                'Попробуйте проверить позже или свяжитесь с поддержкой';

            await this.bot.editMessageText(errorMessage, {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [[
                        { text: '🔄 Проверить снова', callback_data: 'check_payment' }
                    ]]
                }
            });
        }
    }

    async showPaymentOptions(chatId) {
        const paymentMessage = 
            '💫 Оформление подписки ZeusVPN\n\n' +
            '🎁 Что входит в подписку:\n' +
            '🚀 Безлимитный трафик\n' +
            '⚡️ Высокая скорость\n' +
            '📱 Доступ со всех устройств\n' +
            '🛡 Надежная защита\n' +
            '🌿 Техническая поддержка\n\n' +
            '💎 Стоимость: 100₽/месяц\n\n' +
            '💳 Способы оплаты:\n' +
            '• Банковская карта\n' +
            '• СБП\n' +
            '• ЮMoney';

        const keyboard = {
            inline_keyboard: [
                [{ text: '💳 Оплатить картой', url: `https://www.donationalerts.com/r/your_payment_link` }],
                [{ text: '🏦 Оплатить через СБП', callback_data: 'sbp_payment' }],
                [{ text: '💰 Оплатить через ЮMoney', url: 'https://yoomoney.ru/to/your_wallet' }],
                [{ text: '◀️ Назад в меню', callback_data: 'back' }]
            ]
        };

        await this.bot.sendMessage(chatId, paymentMessage, {
            parse_mode: 'HTML',
            reply_markup: keyboard
        });
    }

    async handleSbpPayment(chatId) {
        const sbpMessage = 
            '🏦 Оплата через СБП\n\n' +
            '1️⃣ Отсканируйте QR-код или нажмите кнопку "Открыть СБП"\n' +
            '2️⃣ Укажите сумму 100₽\n' +
            '3️⃣ В комментарии укажите ваш ID:\n' +
            `<code>${chatId}</code>\n\n` +
            '❗️ Важно: платеж должен быть ровно на 100₽';

        const keyboard = {
            inline_keyboard: [
                [{ text: '📱 Открыть СБП', url: 'https://qr.nspk.ru/your_sbp_link' }],
                [{ text: '✅ Я оплатил', callback_data: 'check_payment' }],
                [{ text: '◀️ Назад к способам оплаты', callback_data: 'buy_vpn' }]
            ]
        };

        await this.bot.sendMessage(chatId, sbpMessage, {
            parse_mode: 'HTML',
            reply_markup: keyboard
        });
    }
}

module.exports = new TelegramService(); 