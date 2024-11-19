const crypto = require('crypto');

class PaystoService {
    constructor() {
        this.secretKey = process.env.PAYSTO_SECRET_KEY;
        this.shopId = process.env.PAYSTO_SHOP_ID;
        this.successUrl = process.env.PAYSTO_SUCCESS_URL;
        this.failUrl = process.env.PAYSTO_FAIL_URL;
    }

    generatePaymentUrl(orderId, amount) {
        const data = {
            SHOP_ID: this.shopId,
            AMOUNT: amount,
            CURRENCY: 'RUB',
            ORDER_ID: orderId,
            SUCCESS_URL: this.successUrl,
            FAIL_URL: this.failUrl,
            DESCRIPTION: 'Оплата VPN подписки'
        };

        const signature = this.generateSignature(data);
        
        const params = new URLSearchParams({
            ...data,
            SIGNATURE: signature
        });

        return `https://paysto.com/ru/pay/?${params.toString()}`;
    }

    generateSignature(data) {
        const values = [
            data.SHOP_ID,
            data.AMOUNT,
            data.CURRENCY,
            data.ORDER_ID,
            this.secretKey
        ];

        return crypto
            .createHash('md5')
            .update(values.join(':'))
            .digest('hex');
    }

    verifyPayment(payload) {
        const receivedSignature = payload.SIGNATURE;
        delete payload.SIGNATURE;

        const calculatedSignature = this.generateSignature(payload);
        return receivedSignature === calculatedSignature;
    }
}

module.exports = new PaystoService(); 