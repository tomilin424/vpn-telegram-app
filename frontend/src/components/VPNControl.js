import React, { useState, useEffect } from 'react';
import './VPNControl.css';

function VPNControl() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'https://195.211.124.224:3001/api'; // Обновленный URL бэкенда

  useEffect(() => {
    checkVPNStatus();
  }, []);

  const checkVPNStatus = async () => {
    try {
      const tg = window.Telegram.WebApp;
      const response = await fetch(`${API_URL}/vpn/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tg.initData}`
        }
      });
      const data = await response.json();
      setIsConnected(data.isConnected);
    } catch (error) {
      console.error('Error checking VPN status:', error);
      setError('Ошибка при проверке статуса VPN');
    }
  };

  const toggleVPN = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const tg = window.Telegram.WebApp;
      const response = await fetch(`${API_URL}/vpn/${isConnected ? 'disconnect' : 'connect'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tg.initData}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setIsConnected(!isConnected);
        if (!isConnected && data.config) {
          // Показываем конфигурацию пользователю
          tg.showPopup({
            title: 'VPN Подключен',
            message: 'Скопируйте конфигурацию для использования в вашем VPN клиенте',
            buttons: [
              {text: 'Копировать', type: 'default'},
              {text: 'Закрыть', type: 'cancel'}
            ]
          });
        }
      } else {
        setError(data.message || 'Ошибка при подключении к VPN');
      }
    } catch (error) {
      console.error('VPN connection error:', error);
      setError('Ошибка сервера. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="vpn-control">
      <button 
        className={`vpn-button ${isConnected ? 'connected' : 'disconnected'} ${isLoading ? 'loading' : ''}`}
        onClick={toggleVPN}
        disabled={isLoading}
      >
        {isLoading ? 'Подождите...' : isConnected ? 'Отключить' : 'Подключить'}
      </button>
      <div className="status-text">
        Статус: {isLoading ? 'Подключение...' : isConnected ? 'Подключено' : 'Отключено'}
      </div>
      {error && <div className="error-text">{error}</div>}
    </div>
  );
}

export default VPNControl;

