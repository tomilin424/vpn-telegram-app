import React from 'react';
import './Navigation.css';

const Navigation = ({ currentPage, setCurrentPage }) => {
  return (
    <div className="navigation">
      <button 
        className={`nav-button ${currentPage === 'status' ? 'active' : ''}`}
        onClick={() => setCurrentPage('status')}
      >
        <span className="nav-icon">📊</span>
        <span className="nav-label">Статус</span>
      </button>
      <button 
        className={`nav-button ${currentPage === 'subscription' ? 'active' : ''}`}
        onClick={() => setCurrentPage('subscription')}
      >
        <span className="nav-icon">💎</span>
        <span className="nav-label">Подписка</span>
      </button>
      <button 
        className={`nav-button ${currentPage === 'referral' ? 'active' : ''}`}
        onClick={() => setCurrentPage('referral')}
      >
        <span className="nav-icon">👥</span>
        <span className="nav-label">Рефералы</span>
      </button>
      <button 
        className={`nav-button ${currentPage === 'faq' ? 'active' : ''}`}
        onClick={() => setCurrentPage('faq')}
      >
        <span className="nav-icon">❓</span>
        <span className="nav-label">FAQ</span>
      </button>
    </div>
  );
};

export default Navigation; 