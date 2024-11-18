import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import '../styles/SettingsScreen.css';
import ServerMonitor from './ServerMonitor';

function SettingsScreen() {
  const [selectedServer, setSelectedServer] = useState('auto');
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);

  useEffect(() => {
    fetchSubscriptionInfo();
  }, []);

  const fetchSubscriptionInfo = async () => {
    try {
      const response = await fetch('/api/subscription/status', {
        headers: {
          'Authorization': `Bearer ${WebApp.initData}`
        }
      });
      const data = await response.json();
      setSubscriptionInfo(data);
    } catch (error) {
      console.error('Ошибка при получении информации о подписке:', error);
    }
  };

  const handleServerChange = (event) => {
    setSelectedServer(event.target.value);
  };

  const handleDisconnect = async () => {
    try {
      await fetch('/api/vpn/disconnect', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WebApp.initData}`
        }
      });
      WebApp.showAlert('VPN отключен');
    } catch (error) {
      console.error('Ошибка при отключении VPN:', error);
    }
  };

  return (
    <div className="settings-screen">
      <h2>Настройки</h2>
      
      <ServerMonitor />
      
      <div className="settings-section">
        <h3>Выбор сервера</h3>
        <select value={selectedServer} onChange={handleServerChange}>
          <option value="auto">Автоматический выбор</option>
          <option value="eu">Европа</option>
          <option value="us">США</option>
          <option value="asia">Азия</option>
        </select>
      </div>

      {subscriptionInfo && (
        <div className="subscription-info">
          <h3>Информация о подписке</h3>
          <p>Статус: {subscriptionInfo.isActive ? 'Активна' : 'Неактивна'}</p>
          <p>Действует до: {new Date(subscriptionInfo.endDate).toLocaleDateString()}</p>
        </div>
      )}

      <button onClick={handleDisconnect} className="disconnect-button">
        Отключить VPN
      </button>
    </div>
  );
}

export default SettingsScreen; 