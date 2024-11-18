import React, { useState } from 'react';
import './Subscription.css';

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
          userId: window.Telegram.WebApp.initDataUnsafe.user.id,
          amount: 250,
          currency: 'RUB'
        }),
      });

      const data = await response.json();
      if (data.success) {
        if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          window.Telegram.WebApp.showAlert(data.message || 'Инструкции отправлены в бот');
        }
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
          className="payment-button card"
        >
          💳 Оплатить картой
        </button>
        <button 
          onClick={() => handlePayment('crypto')} 
          disabled={loading}
          className="payment-button crypto"
        >
          🪙 Оплатить в крипте
        </button>
      </div>
      {loading && <div className="loading">Обработка платежа...</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Subscription; 