const paymentProcessor = require('../../services/paymentProcessor');

module.exports = async (ctx) => {
  const payment = ctx.update.pre_checkout_query;
  try {
    const isValid = await paymentProcessor.verifyPayment(payment);
    if (isValid) {
      await ctx.answerPreCheckoutQuery(true);
    } else {
      await ctx.answerPreCheckoutQuery(false, 'Ошибка при проверке платежа');
    }
  } catch (error) {
    console.error('Ошибка при обработке платежа:', error);
    await ctx.answerPreCheckoutQuery(false, 'Произошла ошибка');
  }
}; 