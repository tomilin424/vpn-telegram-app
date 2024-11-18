import React from 'react';
import WebApp from '@twa-dev/sdk';

function SubscriptionScreen() {
  const handleSubscribe = async () => {
    try {
      WebApp.showPopup({
        title: 'Подписка VPN',
        message: 'Стоимость подписки: 250 рублей в месяц\n\nПреимущества:\n- Безлимитный трафик\n- Высокая скорость\n- Защищенное соединение',
        buttons: [
          { 
            id: 'subscribe', 
            type: 'default', 
            text: 'Оформить подписку',
            onClick: async () => {
              try {
                // Отправляем команду боту для создания счета
                WebApp.sendData(JSON.stringify({
                  action: 'subscribe',
                  amount: 250,
                  subscriptionType: 1
                }));
              } catch (error) {
                console.error('Ошибка при отправке команды:', error);
                WebApp.showAlert('Произошла ошибка при оформлении подписки');
              }
            }
          },
          { 
            id: 'cancel', 
            type: 'cancel', 
            text: 'Отмена' 
          }
        ]
      });
    } catch (error) {
      console.error('Ошибка при оформлении подписки:', error);
      WebApp.showAlert('Произошла ошибка при оформлении подписки');
    }
  };

  return (
    <div className="subscription-screen">
      <h2>Подписка на VPN</h2>
      <div className="subscription-info">
        <div className="price">
          <span className="amount">250₽</span>
          <span className="period">/месяц</span>
        </div>
        <ul className="features">
          <li>✓ Безлимитный трафик</li>
          <li>✓ Высокая скорость соединения</li>
          <li>✓ Защищенный канал связи</li>
          <li>✓ Доступ к заблокированным ресурсам</li>
        </ul>
        <button onClick={handleSubscribe} className="subscribe-button">
          Оформить подписку
        </button>
      </div>
    </div>
  );
}

export default SubscriptionScreen; 