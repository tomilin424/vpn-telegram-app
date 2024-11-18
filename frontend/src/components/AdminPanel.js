import React, { useState, useEffect } from 'react';
import { WebApp } from '@twa-dev/sdk/dist';
import './AdminPanel.css';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'x-telegram-init-data': WebApp.initData,
        }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      setError('Ошибка загрузки статистики');
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-panel">
      <h1>Панель администратора</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Пользователи</h3>
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-label">Всего</div>
        </div>
        
        <div className="stat-card">
          <h3>Активные VPN</h3>
          <div className="stat-value">{stats.activeUsers}</div>
          <div className="stat-label">Пользователей</div>
        </div>
      </div>

      <div className="recent-payments">
        <h3>Последние платежи</h3>
        <div className="payments-list">
          {stats.recentPayments.map((payment, index) => (
            <div key={index} className="payment-item">
              <div className="payment-amount">{payment.amount} {payment.currency}</div>
              <div className="payment-status" data-status={payment.status}>
                {payment.status}
              </div>
              <div className="payment-date">
                {new Date(payment.date).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 