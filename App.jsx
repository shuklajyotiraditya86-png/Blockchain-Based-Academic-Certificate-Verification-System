import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomeSection from './components/HomeSection';
import AdminSection from './components/AdminSection';
import AddCertificateSection from './components/AddCertificateSection';
import PendingSection from './components/PendingSection';
import VerifiedSection from './components/VerifiedSection';
import ContactSection from './components/ContactSection';
import AuthModal from './components/AuthModal';
import CertificateModal from './components/CertificateModal';

import { 
  INITIAL_ADMINS, 
  INITIAL_VERIFIED_CERTIFICATES, 
  INITIAL_PENDING_CERTIFICATES, 
  loadStoredData, 
  saveStoredData 
} from './data/mockData';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Modern Theme Engine: Dark / Light with localStorage persistence
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('certledger_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('certledger_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };
  
  const [adminsList, setAdminsList] = useState(() => 
    loadStoredData('admins', INITIAL_ADMINS)
  );

  const [currentUser, setCurrentUser] = useState(() => 
    loadStoredData('current_user', null)
  );

  const [verifiedCertificates, setVerifiedCertificates] = useState(() => 
    loadStoredData('verified_certs', INITIAL_VERIFIED_CERTIFICATES)
  );

  const [pendingCertificates, setPendingCertificates] = useState(() => 
    loadStoredData('pending_certs', INITIAL_PENDING_CERTIFICATES)
  );

  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [searchQueryForVerified, setSearchQueryForVerified] = useState('');
  const [systemToast, setSystemToast] = useState(null);

  const blockHeight = 148200 + verifiedCertificates.length;

  const showToast = (message, type = 'success') => {
    setSystemToast({ message, type });
    setTimeout(() => {
      setSystemToast(null);
    }, 3500);
  };

  useEffect(() => {
    saveStoredData('admins', adminsList);
  }, [adminsList]);

  useEffect(() => {
    saveStoredData('current_user', currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveStoredData('verified_certs', verifiedCertificates);
  }, [verifiedCertificates]);

  useEffect(() => {
    saveStoredData('pending_certs', pendingCertificates);
  }, [pendingCertificates]);

  const handleLogin = (admin) => {
    setCurrentUser(admin);
    showToast(`Welcome back, ${admin.name}! Authenticated to Node ${admin.nodeId}.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Signed out of administrative node session.', 'info');
  };

  const handleRegister = (newAdmin) => {
    setAdminsList(prev => [...prev, newAdmin]);
    showToast(`Institution ${newAdmin.institution} registered with Validator Node ${newAdmin.nodeId}!`);
  };

  const handleAddPendingCertificate = (cert) => {
    const pendingItem = {
      ...cert,
      status: 'PENDING',
      submittedAt: new Date().toISOString()
    };
    setPendingCertificates(prev => [pendingItem, ...prev]);
    showToast(`Certificate for ${cert.studentName} added to Pending Consensus Queue.`);
  };

  const handleAddVerifiedCertificate = (cert) => {
    const nextBlockHeight = blockHeight + 1;
    const verifiedItem = {
      ...cert,
      blockHeight: nextBlockHeight,
      status: 'VERIFIED',
      verifiedAt: new Date().toISOString()
    };

    setVerifiedCertificates(prev => [verifiedItem, ...prev]);
    setPendingCertificates(prev => prev.filter(c => c.id !== cert.id));
    showToast(`Certificate sealed to Block #${nextBlockHeight} with SHA-256 integrity.`);
  };

  const handleApproveCertificate = (cert) => {
    const nextBlockHeight = blockHeight + 1;
    const approvedCert = {
      ...cert,
      blockHeight: nextBlockHeight,
      status: 'VERIFIED',
      verifiedAt: new Date().toISOString()
    };

    setVerifiedCertificates(prev => [approvedCert, ...prev]);
    setPendingCertificates(prev => prev.filter(c => c.id !== cert.id));
    showToast(`Approved & Mined: Certificate #${cert.id} is now immutably verified!`);
  };

  const handleRejectCertificate = (id) => {
    setPendingCertificates(prev => prev.filter(c => c.id !== id));
    showToast('Pending certificate request was dismissed.', 'info');
  };

  const handleHeroSearch = (query) => {
    setSearchQueryForVerified(query);
    setActiveSection('verified');
  };

  return (
    <div className={`app-layout ${theme === 'light' ? 'light-mode' : 'dark-mode'}`}>
      {/* Toast Notification */}
      {systemToast && (
        <div className={`system-toast ${systemToast.type}`}>
          <div className="toast-dot"></div>
          <span>{systemToast.message}</span>
        </div>
      )}

      {/* Mobile Backdrop */}
      {mobileNavOpen && (
        <div 
          className="mobile-backdrop" 
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <Sidebar 
        activeSection={activeSection}
        setActiveSection={(sec) => {
          setActiveSection(sec);
          setMobileNavOpen(false);
        }}
        pendingCount={pendingCertificates.length}
        verifiedCount={verifiedCertificates.length}
        currentUser={currentUser}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <div className={`main-viewport ${isSidebarCollapsed ? 'expanded' : ''}`}>
        <Header 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          currentUser={currentUser}
          onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
          blockHeight={blockHeight}
          pendingCount={pendingCertificates.length}
          mobileNavOpen={mobileNavOpen}
          setMobileNavOpen={setMobileNavOpen}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <main className="main-content-scroll">
          {activeSection === 'home' && (
            <HomeSection 
              verifiedCertificates={verifiedCertificates}
              pendingCertificates={pendingCertificates}
              setActiveSection={setActiveSection}
              onSelectCertificate={setSelectedCertificate}
              onSearchQuery={handleHeroSearch}
            />
          )}

          {activeSection === 'admin' && (
            <AdminSection 
              currentUser={currentUser}
              adminsList={adminsList}
              onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
              setActiveSection={setActiveSection}
              pendingCount={pendingCertificates.length}
              verifiedCount={verifiedCertificates.length}
              blockHeight={blockHeight}
            />
          )}

          {activeSection === 'add-certificate' && (
            <AddCertificateSection 
              currentUser={currentUser}
              onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
              onAddPendingCertificate={handleAddPendingCertificate}
              onAddVerifiedCertificate={handleAddVerifiedCertificate}
              lastVerifiedBlock={verifiedCertificates[0]}
              onSelectCertificate={setSelectedCertificate}
            />
          )}

          {activeSection === 'pending' && (
            <PendingSection 
              pendingCertificates={pendingCertificates}
              onApproveCertificate={handleApproveCertificate}
              onRejectCertificate={handleRejectCertificate}
              onSelectCertificate={setSelectedCertificate}
              setActiveSection={setActiveSection}
            />
          )}

          {activeSection === 'verified' && (
            <VerifiedSection 
              verifiedCertificates={verifiedCertificates}
              onSelectCertificate={setSelectedCertificate}
              initialSearchQuery={searchQueryForVerified}
              setActiveSection={setActiveSection}
            />
          )}

          {activeSection === 'contact' && (
            <ContactSection />
          )}
        </main>
      </div>

      <AuthModal 
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        onLogin={handleLogin}
        onRegister={handleRegister}
        adminsList={adminsList}
      />

      <CertificateModal 
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />
    </div>
  );
}
