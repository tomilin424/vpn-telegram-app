import React, { useEffect } from 'react';
import { WebApp } from '@twa-dev/sdk';

function Notifications({ subscriptionEndDate }) {
  useEffect(() => {
    checkSubscriptionStatus();
  }, [subscriptionEndDate]);

  const checkSubscriptionStatus = () => {
    if (!subscriptionEndDate) return;

    const endDate = new Date(subscriptionEndDate);
    const now = new Date();
    const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 3) {
      WebApp.showPopup({
        title: 'Внимание',
        message: `Ваша подписка истекает через ${daysLeft} ${getDaysWord(daysLeft)}`,
        buttons: [
          { 
            id: 'renew', 
            type: 'default', 
            text: 'Продлить подписку'
          },
          {
            id: 'close',
            type: 'cancel',
            text: 'Закрыть'
          }
        ]
      });
    }
  };

  const getDaysWord = (days) => {
    if (days === 1) return 'день';
    if (days > 1 && days < 5) return 'дня';
    return 'дней';
  };

  return null; // Компонент не рендерит UI
}

export default Notifications; 