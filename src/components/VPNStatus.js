import React, { useState, useEffect } from 'react';
import './VPNStatus.css';

const VPNStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/status/${window.Telegram.WebApp.initDataUnsafe.user.id}`);
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error('Error fetching status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="vpn-status">
      <h2>Статус VPN</h2>
      <div className={`status-indicator ${status?.isActive ? 'active' : 'inactive'}`}>
        {status?.isActive ? 'Подключено' : 'Отключено'}
      </div>
      {status?.subscriptionEndDate && (
        <div className="subscription-info">
          Подписка активна до: {new Date(status.subscriptionEndDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default VPNStatus; 