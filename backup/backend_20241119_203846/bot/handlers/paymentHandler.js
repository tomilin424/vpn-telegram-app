const { Markup } = require('telegraf');
const paystoService = require('../../services/paystoService');
const { createOrder } = require('../../services/orderService');

async function handlePayment(ctx) {
    try {
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
    } catch (error) {
        console.error('Payment error:', error);
        await ctx.reply('Произошла ошибка. Попробуйте позже.');
    }
}

async function handleCardPayment(ctx) {
    try {
        const orderId = `ORDER_${Date.now()}_${ctx.from.id}`;
        const amount = 100;

        await createOrder({
            orderId,
            userId: ctx.from.id,
            amount,
            status: 'pending'
        });

        const paymentUrl = paystoService.generatePaymentUrl(orderId, amount);

        await ctx.reply(
            'Для оплаты картой перейдите по ссылке:',
            Markup.inlineKeyboard([
                [Markup.button.url('Оплатить картой', paymentUrl)]
            ])
        );
    } catch (error) {
        console.error('Card payment error:', error);
        await ctx.reply('Произошла ошибка при создании платежа. Попробуйте позже.');
    }
}

async function handleSBPPayment(ctx) {
    // Логика для оплаты через СБП
    await ctx.reply('Оплата через СБП временно недоступна');
}

async function handleYooMoneyPayment(ctx) {
    // Логика для оплаты через ЮMoney
    await ctx.reply('Оплата через ЮMoney временно недоступна');
}

async function handleInstructions(ctx, os) {
    const instructions = {
        'Android': {
            text: 'Инструкция по установке для Android:\n\n' +
                  '1. Установите приложение Outline из Google Play\n' +
                  '2. После установки нажмите "Получить ключ"\n' +
                  '3. Вставьте полученный ключ в приложение',
            image: 'path_to_android_image.jpg'
        },
        'iOS': {
            text: 'Инструкция по установке для iOS:\n\n' +
                  '1. Установите приложение Outline из App Store\n' +
                  '2. После установки нажмите "Получить ключ"\n' +
                  '3. Вставьте полученный ключ в приложение',
            image: 'path_to_ios_image.jpg'
        },
        // Добавьте инструкции для других ОС
    };

    if (instructions[os]) {
        await ctx.reply(instructions[os].text);
        // Если есть изображение, отправляем его
        if (instructions[os].image) {
            // await ctx.replyWithPhoto({ source: instructions[os].image });
        }
    }
}

module.exports = {
    handlePayment,
    handleCardPayment,
    handleSBPPayment,
    handleYooMoneyPayment,
    handleInstructions
}; 