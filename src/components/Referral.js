import React, { useState, useEffect } from 'react';
import './Referral.css';

const Referral = () => {
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const response = await fetch('/api/referral/stats', {
        headers: {
          'x-telegram-init-data': window.Telegram.WebApp.initData,
        }
      });
      const data = await response.json();
      setReferralData(data);
    } catch (error) {
      setError('Ошибка загрузки данных');
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (referralData?.referralCode) {
      const link = `https://t.me/ZeusVPNBot?start=ref_${referralData.referralCode}`;
      navigator.clipboard.writeText(link);
      window.Telegram.WebApp.showAlert('Реферальная ссылка скопирована!');
    }
  };

  const handleWithdraw = async () => {
    try {
      const response = await fetch('/api/referral/payout/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-telegram-init-data': window.Telegram.WebApp.initData,
        },
        body: JSON.stringify({
          method: withdrawMethod,
          address: withdrawAddress
        })
      });

      const data = await response.json();
      if (data.success) {
        window.Telegram.WebApp.showAlert('Заявка на вывод средств принята!');
        setShowWithdrawModal(false);
        fetchReferralData();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      window.Telegram.WebApp.showAlert(`Ошибка: ${error.message}`);
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="referral">
      <div className="referral-header">
        <h2>Партнерская программа</h2>
        <p className="referral-description">
          Приглашайте друзей и получайте 30% от их платежей!
        </p>
      </div>

      <div className="referral-stats">
        <div className="stat-card">
          <span className="stat-value">{referralData?.referralCount || 0}</span>
          <span className="stat-label">Рефералов</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{referralData?.currentEarnings || 0}₽</span>
          <span className="stat-label">Доступно</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{referralData?.totalEarnings || 0}₽</span>
          <span className="stat-label">Всего заработано</span>
        </div>
      </div>

      <div className="referral-link-card">
        <h3>Ваша реферальная ссылка</h3>
        <div className="link-container" onClick={copyReferralLink}>
          <span className="link">t.me/ZeusVPNBot?start=ref_{referralData?.referralCode}</span>
          <button className="copy-button">📋</button>
        </div>
      </div>

      {referralData?.currentEarnings >= 1000 && (
        <button 
          className="withdraw-button"
          onClick={() => setShowWithdrawModal(true)}
        >
          Вывести средства
        </button>
      )}

      {referralData?.recentPayments?.length > 0 && (
        <div className="recent-payments">
          <h3>История начислений</h3>
          <div className="payments-list">
            {referralData.recentPayments.map((payment, index) => (
              <div key={index} className="payment-item">
                <div className="payment-amount">+{payment.amount}₽</div>
                <div className="payment-date">
                  {new Date(payment.date).toLocaleDateString()}
                </div>
                <div className={`payment-status ${payment.status}`}>
                  {payment.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showWithdrawModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Вывод средств</h3>
            <select 
              value={withdrawMethod}
              onChange={(e) => setWithdrawMethod(e.target.value)}
            >
              <option value="">Выберите способ</option>
              <option value="card">На карту</option>
              <option value="crypto">В криптовалюте</option>
            </select>
            <input
              type="text"
              placeholder="Введите реквизиты"
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleWithdraw}>Вывести</button>
              <button onClick={() => setShowWithdrawModal(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Referral; 