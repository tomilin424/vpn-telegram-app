const { Markup } = require('telegraf');
const paystoService = require('../../services/paystoService');
const { createOrder } = require('../../services/orderService');

async function handlePayment(ctx) {
    try {
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

async function handleCryptoPayment(ctx) {
    try {
        const invoice = {
            asset: 'USDT',
            amount: 1.5, // эквивалент 100 рублей в USDT
            description: 'VPN Service Payment',
            hidden_message: 'Thank you for your payment!',
            paid_btn_name: 'Open VPN Bot',
            paid_btn_url: `https://t.me/zeusvpnbot_bot?start=crypto_success_${ctx.from.id}`
        };

        await ctx.reply(
            'Для оплаты криптовалютой перейдите по ссылке:',
            Markup.inlineKeyboard([
                [Markup.button.url('Оплатить криптой', `https://t.me/CryptoBot?start=pay_${Buffer.from(JSON.stringify(invoice)).toString('base64')}`)]
            ])
        );
    } catch (error) {
        console.error('Crypto payment error:', error);
        await ctx.reply('Произошла ошибка при создании крипто-платежа. Попробуйте позже.');
    }
}

module.exports = {
    handlePayment,
    handleCardPayment,
    handleCryptoPayment
}; 