import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import ServerStats from './ServerStats';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'x-telegram-init-data': window.Telegram.WebApp.initData,
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

  const handlePayoutConfirm = async (payoutId) => {
    try {
      const response = await fetch(`/api/admin/payout/confirm/${payoutId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-telegram-init-data': window.Telegram.WebApp.initData,
        }
      });
      
      if (response.ok) {
        fetchStats();
        window.Telegram.WebApp.showAlert('Выплата подтверждена');
      } else {
        throw new Error('Failed to confirm payout');
      }
    } catch (error) {
      window.Telegram.WebApp.showAlert('Ошибка при подтверждении выплаты');
    }
  };

  const renderGeneralStats = () => (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Пользователи</h3>
          <div className="stat-value">{stats?.totalUsers || 0}</div>
          <div className="stat-label">Всего</div>
        </div>
        
        <div className="stat-card">
          <h3>Активные VPN</h3>
          <div className="stat-value">{stats?.activeUsers || 0}</div>
          <div className="stat-label">Пользователей</div>
        </div>

        <div className="stat-card">
          <h3>Доход</h3>
          <div className="stat-value">{stats?.totalRevenue || 0}₽</div>
          <div className="stat-label">За месяц</div>
        </div>
      </div>

      <div className="recent-payments">
        <h3>Последние платежи</h3>
        <div className="payments-list">
          {stats?.recentPayments?.map((payment, index) => (
            <div key={index} className="payment-item">
              <div className="payment-user">ID: {payment.userId}</div>
              <div className="payment-amount">{payment.amount}₽</div>
              <div className="payment-date">
                {new Date(payment.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderReferralStats = () => (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Рефералы</h3>
          <div className="stat-value">{stats?.totalReferrals || 0}</div>
          <div className="stat-label">Всего</div>
        </div>
        
        <div className="stat-card">
          <h3>Выплаты</h3>
          <div className="stat-value">{stats?.totalReferralPayouts || 0}₽</div>
          <div className="stat-label">За все время</div>
        </div>

        <div className="stat-card">
          <h3>Ожидают выплаты</h3>
          <div className="stat-value">{stats?.pendingPayouts || 0}</div>
          <div className="stat-label">Заявок</div>
        </div>
      </div>

      <div className="pending-payouts">
        <h3>Заявки на выплату</h3>
        <div className="payouts-list">
          {stats?.pendingPayoutRequests?.map((payout, index) => (
            <div key={index} className="payout-item">
              <div className="payout-info">
                <div className="payout-user">ID: {payout.userId}</div>
                <div className="payout-amount">{payout.amount}₽</div>
                <div className="payout-method">{payout.method}</div>
              </div>
              <button 
                className="confirm-button"
                onClick={() => handlePayoutConfirm(payout.id)}
              >
                Подтвердить
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderServerStats = () => (
    <ServerStats stats={stats?.serverStats || { servers: [] }} />
  );

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-panel">
      <h1>Панель администратора</h1>
      
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          Общая статистика
        </button>
        <button 
          className={`tab-button ${activeTab === 'servers' ? 'active' : ''}`}
          onClick={() => setActiveTab('servers')}
        >
          Серверы
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Пользователи
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'general' && renderGeneralStats()}
        {activeTab === 'servers' && renderServerStats()}
        {activeTab === 'users' && renderUsersList()}
      </div>
    </div>
  );
};

export default AdminPanel; 