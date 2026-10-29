import React, { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './App.css'

// Error Boundary Component - Render hatalarını yakalar
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>⚠️ Bir hata oluştu!</h1>
          <p>Sayfa yüklenirken bir sorun yaşandı.</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Sayfayı Yenile
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Lazy loading for pages - Code splitting
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Production = React.lazy(() => import('./pages/Production'))
const Cut = React.lazy(() => import('./pages/Cut'))
const Sale = React.lazy(() => import('./pages/Sale'))
const Return = React.lazy(() => import('./pages/Return'))
const LotTrace = React.lazy(() => import('./pages/LotTrace'))
const Report = React.lazy(() => import('./pages/Report'))

// Root render - App.jsx'deki App bileşenini kullanıyoruz
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode future={["v7_startTransition", "v7_relativeSplatPath"]}>
    <BrowserRouter future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}>
      <ErrorBoundary>
        <Suspense fallback={<div className="loading">⏳ Yükleniyor...</div>}>
          <App />
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
)
