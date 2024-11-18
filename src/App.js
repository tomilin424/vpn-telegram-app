import React, { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import VPNStatus from './components/VPNStatus';
import Subscription from './components/Subscription';
import Referral from './components/Referral';
import FAQ from './components/FAQ';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState('status');

  useEffect(() => {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
    
    const checkAdmin = async () => {
      try {
        const response = await fetch('/api/admin/check', {
          headers: {
            'x-telegram-init-data': window.Telegram.WebApp.initData,
          }
        });
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdmin();
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'status':
        return <VPNStatus />;
      case 'subscription':
        return <Subscription />;
      case 'referral':
        return <Referral />;
      case 'faq':
        return <FAQ />;
      default:
        return <VPNStatus />;
    }
  };

  if (isAdmin) {
    return <AdminPanel />;
  }

  return (
    <div className="App">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="page-container">
        {renderPage()}
      </div>
    </div>
  );
}

export default App; 