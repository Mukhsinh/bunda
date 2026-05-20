import { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Home, FileText, Truck, LogIn, Hospital, Search, Monitor } from 'lucide-react';
import { useAuthStore } from './store/useAuthStore';
import { speakGreeting } from './lib/voiceUtils';

import HomePage from './pages/HomePage';
import Login from './pages/Login';

import SubmitDokumen from './pages/ramah/SubmitDokumen';
import TrackDokumen from './pages/ramah/TrackDokumen';

import RequestTransport from './pages/santun/RequestTransport';
import TrackRide from './pages/santun/TrackRide';

import Empati from './pages/empati/Empati';
import Sehati from './pages/sehati/Sehati';
import Vaksinasi from './pages/vaksinasi/Vaksinasi';
import Sinergi from './pages/Sinergi';

import LacakSelection from './pages/LacakSelection';
import QuranHome from './pages/quran/QuranHome';
import SurahDetail from './pages/quran/SurahDetail';

import AdminPanel from './pages/admin/AdminPanel';
import VideoMeetingArena from './pages/sinergi/VideoMeetingArena';

// Protected route wrapper for admin pages
function AdminRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Memuat...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

function App() {
  const location = useLocation();
  const { initializeAuth } = useAuthStore();
  const [adminViewMode, setAdminViewMode] = useState('mobile');

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const handleViewMode = (e) => setAdminViewMode(e.detail);
    window.addEventListener('admin-view-mode', handleViewMode);
    return () => window.removeEventListener('admin-view-mode', handleViewMode);
  }, []);

  // Voice Greeting Logic
  useEffect(() => {
    const isAdminPage = location.pathname.startsWith('/admin');

    const greetings = {
      '/': 'Selamat Datang para sahabat bunda, nikmati pengalaman melahirkan yang nyaman dan menyenangkan di RSUD Bendan',
      '/empati': 'Hai Bunda, Silakan pelajari video edukasi untuk Bunda paska melahirkan',
      '/sehati': 'Hai Bunda, identifikasi kondisi gizi bayi Bunda secara mudah dan akurat',
      '/vaksinasi': 'Hai Bunda, buat jadwal waktu vaksin bayi bunda dengan mudah',
      '/sinergi': 'Hai Bunda, konsultasikan tumbuh kembang ananda bersama ahli gizi kami melalui video meet',
      '/quran': 'Hai Bunda, bacalah alquran untuk ketenangan hati Bunda',
      '/ramah/submit': 'Hai Bunda, ajukan pengurusan akte dengan mudah dan gratis cukup isi form dan unggah dokumen yang diperlukan disini',
      '/santun/submit': 'Hai Bunda, ajukan pengantaran pulang ke rumah Bunda dengan nyaman dan gratis, silakan isi form disini',
      '/lacak': 'Hai bunda, untuk melacak proses pengajuan silakan masukan kode registrasi Bunda saat pengajuan layanan'
    };

    const currentPath = location.pathname.toLowerCase();
    const message = greetings[currentPath];

    if (message && !isAdminPage) {
      const timer = setTimeout(() => {
        speakGreeting(message);
      }, 800);
      return () => {
        clearTimeout(timer);
        window.speechSynthesis?.cancel();
      };
    }
  }, [location.pathname]);

  // Check if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAdminDashboard = location.pathname === '/admin/dashboard';
  const useWebMode = isAdminDashboard && adminViewMode === 'web';

  return (
    <div className={`app-container ${useWebMode ? 'web-mode' : ''}`}>
      {/* App Bar Removed as requested */}

      {/* Main Content Area */}
      <main className="app-content">
        <Routes>
          {/* Public Patient Routes */}
          <Route path="/" element={<HomePage />} />

          <Route path="/ramah/submit" element={<SubmitDokumen />} />
          <Route path="/ramah/track" element={<TrackDokumen />} />

          <Route path="/santun/submit" element={<RequestTransport />} />
          <Route path="/santun/track" element={<TrackRide />} />

          <Route path="/empati" element={<Empati />} />
          <Route path="/sehati" element={<Sehati />} />
          <Route path="/vaksinasi" element={<Vaksinasi />} />
          <Route path="/sinergi" element={<Sinergi />} />
          <Route path="/sinergi/video" element={<VideoMeetingArena />} />

          <Route path="/lacak" element={<LacakSelection />} />

          <Route path="/quran" element={<QuranHome />} />
          <Route path="/quran/:id" element={<SurahDetail />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Footer */}
        <footer style={{
          textAlign: 'center',
          paddingTop: '24px',
          paddingLeft: '12px',
          paddingRight: '12px',
          marginTop: '20px',
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          borderTop: '1px solid rgba(0,0,0,0.05)',
          paddingBottom: isAdminPage ? '24px' : '30px',
          whiteSpace: 'nowrap',
          letterSpacing: '0.2px',
        }}>
          SahabatBunda @ 2026. Mukhsin Hadi. All right Reserved
        </footer>
      </main>

      {/* Bottom Navigation - Only for patient pages */}
      {!isAdminPage && (
        <nav className="bottom-nav">
          <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <Home size={22} />
            <span>Beranda</span>
          </Link>
          <Link to="/ramah/submit" className={`nav-item ${location.pathname.startsWith('/ramah') ? 'active' : ''}`}>
            <FileText size={22} />
            <span>RAMAH</span>
          </Link>
          <Link to="/santun/submit" className={`nav-item ${location.pathname.startsWith('/santun') ? 'active' : ''}`}>
            <Truck size={22} />
            <span>SANTUN</span>
          </Link>
          <Link to="/sinergi" className={`nav-item ${location.pathname === '/sinergi' ? 'active' : ''}`}>
            <Monitor size={22} />
            <span>SINERGI</span>
          </Link>
          <Link to="/lacak" className={`nav-item ${location.pathname === '/lacak' ? 'active' : ''}`}>
            <Search size={22} />
            <span>Lacak</span>
          </Link>
        </nav>
      )}
    </div>
  );
}

export default App;
