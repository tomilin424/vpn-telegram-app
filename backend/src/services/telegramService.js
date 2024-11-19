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
            const username = msg.from.username;
            
            await this.bot.sendMessage(chatId, 
                'Привет! Я бот для управления VPN.\n' +
                'Используйте следующие команды:\n' +
                '/getkey - Получить новый VPN ключ\n' +
                '/mykeys - Посмотреть мои ключи\n' +
                '/help - Получить помощь'
            );
        });

        // Команда получения нового ключа
        this.bot.onText(/\/getkey/, async (msg) => {
            const chatId = msg.chat.id;
            const username = msg.from.username;
            
            try {
                const key = await outlineService.createKey(`user_${chatId}`);
                await this.bot.sendMessage(chatId, 
                    'Ваш VPN ключ готов!\n\n' +
                    'Для подключения:\n' +
                    '1. Установите приложение Outline:\n' +
                    'https://getoutline.org/get-started/\n\n' +
                    '2. Скопируйте этот ключ доступа:\n' +
                    `\`${key.accessUrl}\``,
                    { parse_mode: 'Markdown' }
                );
            } catch (error) {
                console.error('Error creating key:', error);
                await this.bot.sendMessage(chatId, 'Произошла ошибка при создании ключа. Попробуйте позже.');
            }
        });

        // Команда просмотра своих ключей
        this.bot.onText(/\/mykeys/, async (msg) => {
            const chatId = msg.chat.id;
            
            try {
                const allKeys = await outlineService.getAllKeys();
                const userKeys = allKeys.accessKeys.filter(key => key.name === `user_${chatId}`);
                
                if (userKeys.length === 0) {
                    await this.bot.sendMessage(chatId, 'У вас пока нет активных ключей. Используйте /getkey для получения ключа.');
                    return;
                }

                let message = 'Ваши активные ключи:\n\n';
                userKeys.forEach((key, index) => {
                    message += `${index + 1}. ID: ${key.id}\n`;
                    message += `Ключ: \`${key.accessUrl}\`\n\n`;
                });

                await this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
            } catch (error) {
                console.error('Error getting keys:', error);
                await this.bot.sendMessage(chatId, 'Произошла ошибка при получении списка ключей. Попробуйте позже.');
            }
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
}

module.exports = new TelegramService(); 