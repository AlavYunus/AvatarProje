import React from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import {
  Home, Factory, Scissors, ShoppingCart, FileText,
  Search, RefreshCw, Sparkles, LogOut, ClipboardList, PackagePlus
} from 'lucide-react'
import './App.css'

// Mevcut Sayfalar
import Dashboard from './pages/Dashboard'
import Production from './pages/Production'
import Cut from './pages/Cut'
import Sale from './pages/Sale'
import Return from './pages/Return'
import LotTrace from './pages/LotTrace'
import Report from './pages/Report'
import Login from './pages/Login'
import Register from './pages/Register'
import Account from './pages/Account'

// Rol Bazlı Özelleştirilmiş Sayfalar
import ButcherRequests from './pages/ButcherRequests'
import OperatorTasks from './pages/OperatorTasks'
import MarketOrders from './pages/MarketOrders'

// Rol Bazlı Oturum Koruyucu Katman (RBAC Guard)
const RoleRoute = ({ children, allowedRoles }) => {
  const userString = localStorage.getItem('avatar_user')
  if (!userString) return <Navigate to="/login" replace />

  const user = JSON.parse(userString)
  if (allowedRoles.includes(user.role) || user.role === 'admin') {
    return children
  } const RoleRoute = ({ children, allowedRoles }) => {
    const userString = localStorage.getItem('avatar_user')
    if (!userString) return <Navigate to="/login" replace />

    const user = JSON.parse(userString)
    if (allowedRoles.includes(user.role) || user.role === 'admin') {
      return children
    }
    return <Navigate to="/" replace />
  }
}
function App() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const userString = localStorage.getItem('avatar_user')
  const user = userString ? JSON.parse(userString) : null
  const isAuthenticated = user !== null

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  const handleLogout = () => {
    localStorage.removeItem('avatar_user')
    localStorage.removeItem('avatar_token')
    window.location.href = '/login'
  }

  return (
    <div className="app">
      {isAuthenticated && !isAuthPage && (
        <nav className="navbar">
          <Link to="/" className="navbar-logo" onClick={() => setIsMenuOpen(false)}>
            <div className="logo-mark"><Sparkles size={20} /></div>
            <div className="logo-copy">
              <span className="logo-title">AVATAR</span>
              <span className="logo-tag">AI Gıda Üretim & İzlenebilirlik</span>
            </div>
          </Link>

          <button className={`navbar-toggle ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
          <ul className={`navbar-menu ${isMenuOpen ? 'mobile-open' : ''}`}>
            {/* ─── TÜM ROLLERİN ORTAK GÖREBİLECEĞİ KANALLAR ─── */}
            <li>
              <Link to="/" className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                <Home size={16} />
                <span>Ana Sayfa</span>
              </Link>
            </li>
            <li>
              <Link to="/lot-trace" className={`navbar-link ${location.pathname === '/lot-trace' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                <Search size={16} />
                <span>Lot İzleme</span>
              </Link>
            </li>

            {/* ─── KASAPBAŞI (BUTCHER) YETKİ ALANI ─── */}
            {(user?.role === 'admin' || user?.role === 'kasap') && (
              <>
                <li>
                  <Link to="/cut" className={`navbar-link ${location.pathname === '/cut' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                    <Scissors size={16} />
                    <span>Parçalama İşlemi</span>
                  </Link>
                </li>
                <li>
                  <Link to="/butcher-requests" className={`navbar-link ${location.pathname === '/butcher-requests' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                    <ClipboardList size={16} />
                    <span>Kesim İstekleri</span>
                  </Link>
                </li>
              </>
            )}

            {/* ─── SAHA ŞEFİ / OPERATÖR YETKİ ALANI ─── */}
            {(user?.role === 'admin' || user?.role === 'operator') && (
              <>
                <li>
                  <Link to="/production" className={`navbar-link ${location.pathname === '/production' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                    <Factory size={16} />
                    <span>Üretim Emirleri</span>
                  </Link>
                </li>
                <li>
                  <Link to="/operator-tasks" className={`navbar-link ${location.pathname === '/operator-tasks' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                    <ClipboardList size={16} />
                    <span>Proses Görevleri</span>
                  </Link>
                </li>
              </>
            )}

            {/* ─── ZİNCİR MARKET ALICISI (MARKET) YETKİ ALANI ─── */}
            {(user?.role === 'admin' || user?.role === 'market') && (
              <li>
                <Link to="/market-orders" className={`navbar-link ${location.pathname === '/market-orders' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <PackagePlus size={16} />
                  <span>Sipariş & Geri Bildirim</span>
                </Link>
              </li>
            )}

            {/* ─── ÜST STRATEJİK YÖNETİM ALANI (Sadece Tam Yetkili Yönetici Görebilir) ─── */}
        
          {user?.role === 'admin' && (
            <>
              <li>
                <Link to="/sale" className={`navbar-link ${location.pathname === '/sale' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <ShoppingCart size={16} />
                  <span>Satış Yönetimi</span>
                </Link>
              </li>
              <li>
                <Link to="/return" className={`navbar-link ${location.pathname === '/return' ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <RefreshCw size={16} />
                  <span>Geri İade Yönetimi</span>
                </Link>
              </li>
              <li>
                <Link to="/report" className={`navbar-link ${location.pathname.startsWith('/report') ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                  <FileText size={16} />
                  <span>Yönetici Raporları</span>
                </Link>
              </li>
            </>
          )}  
          </ul>
          <div className="navbar-user-zone">
            <Link to="/account" className={`navbar-profile-card ${location.pathname === '/account' ? 'profile-active' : ''}`} onClick={() => setIsMenuOpen(false)}>
              <div className="profile-avatar">{user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}</div>
              <div className="profile-info">
                <span className="profile-name">{user?.fullName || 'İşletme Personeli'}</span>
                <span className="profile-role">🤖 {user?.role}</span>
              </div>
            </Link>
            <button onClick={handleLogout} className="btn-logout" title="Güvenli Çıkış"><LogOut size={18} /></button>
          </div>
        </nav>
      )}

      <main className="app-main">
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />} />

          {/* Korunan ve Rol Filtreli Rotalar */}
          <Route path="/" element={<RoleRoute allowedRoles={['admin', 'kasap', 'operator', 'market']}><Dashboard /></RoleRoute>} />
          <Route path="/lot-trace" element={<RoleRoute allowedRoles={['admin', 'kasap', 'operator', 'market']}><LotTrace /></RoleRoute>} />
          <Route path="/account" element={<RoleRoute allowedRoles={['admin', 'kasap', 'operator', 'market']}><Account /></RoleRoute>} />

          <Route path="/cut" element={<RoleRoute allowedRoles={['kasap']}><Cut /></RoleRoute>} />
          <Route path="/butcher-requests" element={<RoleRoute allowedRoles={['kasap']}><ButcherRequests /></RoleRoute>} />

          <Route path="/production" element={<RoleRoute allowedRoles={['operator']}><Production /></RoleRoute>} />
          <Route path="/operator-tasks" element={<RoleRoute allowedRoles={['operator']}><OperatorTasks /></RoleRoute>} />

          <Route path="/sale" element={<RoleRoute allowedRoles={['admin']}><Sale /></RoleRoute>} />
          <Route path="/return" element={<RoleRoute allowedRoles={['admin']}><Return /></RoleRoute>} />
          <Route path="/market-orders" element={<RoleRoute allowedRoles={['market']}><MarketOrders /></RoleRoute>} />

          <Route path="/report" element={<RoleRoute allowedRoles={['admin']}><Report /></RoleRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toaster position="top-right" />
    </div>
  )
}

export default App
