import React, { useState } from 'react';
import { WebApp } from '@twa-dev/sdk/dist';

const Subscription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async (method) => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = method === 'crypto' ? '/api/payment/crypto' : '/api/payment/card';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: WebApp.initDataUnsafe.user.id,
          amount: 10, // Цена подписки
          currency: method === 'crypto' ? 'USDT' : 'USD'
        }),
      });

      const data = await response.json();
      if (data.success) {
        window.location.href = data.paymentUrl;
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Ошибка при обработке платежа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscription">
      <h2>Подписка на VPN</h2>
      <div className="payment-options">
        <button 
          onClick={() => handlePayment('card')} 
          disabled={loading}
        >
          Оплатить картой
        </button>
        <button 
          onClick={() => handlePayment('crypto')} 
          disabled={loading}
        >
          Оплатить в крипте
        </button>
      </div>
      {loading && <div>Обработка платежа...</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Subscription; 