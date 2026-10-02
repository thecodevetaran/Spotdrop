import React, { useState, useEffect } from 'react';
import StatusBar from './components/StatusBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TasteGatekeeper from './components/TasteGatekeeper';
import CityIntro from './sections/CityIntro';
import DropsSection from './components/DropsSection';
import PersonalitySection from './sections/PersonalitySection';
import ProductTease from './components/ProductTease';
import DropOrSkip from './components/DropOrSkip';
import FinalWaitlist from './sections/FinalWaitlist';
import Footer from './components/Footer';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { initReferralTracking } from './utils/referral';

export default function App() {
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Initialize referral tracking from ?ref= parameter & listen to history changes
  useEffect(() => {
    initReferralTracking();

    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Check admin authentication state if visiting /admin
  useEffect(() => {
    if (currentPath === '/admin' || currentPath.startsWith('/admin')) {
      setCheckingAuth(true);
      fetch('/api/admin/me')
        .then((res) => {
          if (res.ok) {
            setIsAdminAuthenticated(true);
          } else {
            setIsAdminAuthenticated(false);
          }
        })
        .catch(() => setIsAdminAuthenticated(false))
        .finally(() => setCheckingAuth(false));
    } else {
      setCheckingAuth(false);
    }
  }, [currentPath]);

  // If on /admin route
  if (currentPath === '/admin' || currentPath.startsWith('/admin')) {
    if (checkingAuth) {
      return (
        <div
          style={{
            minHeight: '100vh',
            backgroundColor: '#F5F1E8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#111111',
          }}
        >
          Loading Spotdrop Admin...
        </div>
      );
    }

    if (isAdminAuthenticated) {
      return <AdminDashboard onLogout={() => setIsAdminAuthenticated(false)} />;
    }

    return <AdminLogin onLoginSuccess={() => setIsAdminAuthenticated(true)} />;
  }

  // Public Landing Page
  return (
    <div className="min-h-screen flex flex-col selection:bg-[#D8FF45] selection:text-[#111111]">
      {/* 0. Live Drop Status Bar */}
      <StatusBar />

      {/* Sticky minimal header */}
      <Navbar />

      {/* Main Page Flow */}
      <main id="main-content">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Interactive Taste Gatekeeper directly under the Hero */}
        <TasteGatekeeper id="gatekeeper" />

        {/* 3. City Intro Section */}
        <CityIntro />

        {/* 3. The Drops Section */}
        <DropsSection />

        {/* 4. Personality Section */}
        <PersonalitySection />

        {/* 5. Product Tease Section */}
        <ProductTease />

        {/* 6. Interactive Drop or Skip Card */}
        <DropOrSkip />

        {/* 7. Final Waitlist Section */}
        <FinalWaitlist />
      </main>

      {/* 8. Minimal Spacious Footer */}
      <Footer />
    </div>
  );
}
