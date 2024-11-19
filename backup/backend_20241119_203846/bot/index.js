require('dotenv').config({ path: __dirname + '/../.env' });
const { Telegraf } = require('telegraf');
const startCommand = require('./commands/startCommand');
const paymentCommand = require('./commands/paymentCommand');

// Проверяем наличие токена
if (!process.env.BOT_TOKEN) {
    throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf(process.env.BOT_TOKEN);

// Добавим проверку соединения
bot.telegram.getMe()
    .then((botInfo) => {
        console.log('Bot connected successfully:', botInfo.username);
    })
    .catch((error) => {
        console.error('Failed to connect bot:', error);
    });

// Обработка ошибок
bot.catch((err, ctx) => {
    console.error(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

// Регистрируем команды
startCommand(bot);
paymentCommand(bot);

// Запускаем бота
bot.launch()
    .then(() => {
        console.log('Bot started successfully');
    })
    .catch(error => {
        console.error('Error launching bot:', error);
    });

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = { bot }; 