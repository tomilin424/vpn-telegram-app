import React, { useState } from 'react';
import './WithdrawModal.css';

const WithdrawModal = ({ onClose, onSubmit, currentBalance }) => {
  const [method, setMethod] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!method) {
      setError('Выберите способ вывода');
      return;
    }
    if (!address) {
      setError('Введите реквизиты для вывода');
      return;
    }
    onSubmit(method, address);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Вывод средств</h3>
        <p className="balance">Доступно к выводу: {currentBalance}₽</p>
        
        <select 
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="method-select"
        >
          <option value="">Выберите способ вывода</option>
          <option value="card">На банковскую карту</option>
          <option value="crypto">В криптовалюте</option>
        </select>

        {method === 'card' && (
          <input
            type="text"
            placeholder="Номер карты"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="card-input"
          />
        )}

        {method === 'crypto' && (
          <input
            type="text"
            placeholder="USDT TRC20 адрес"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="crypto-input"
          />
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="modal-buttons">
          <button onClick={handleSubmit}>Вывести</button>
          <button onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal; 