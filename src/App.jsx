import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BookingPage from './pages/BookingPage'
import ConfirmationPage from './pages/ConfirmationPage'
import BranchesPage from './pages/BranchesPage'
import AdminDashboard from './pages/AdminDashboard'
import SuperAdminLogin from './pages/SuperAdminLogin'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import { usePageViews } from './hooks/useAnalytics'
import PageTitle from './components/PageTitle'
import { ToastProvider } from './components/ToastProvider'

function AnalyticsWrapper() {
  usePageViews()
  return null
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <PageTitle />
        <AnalyticsWrapper />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/branches" element={<BranchesPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/super-admin/login" element={<SuperAdminLogin />} />
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
        </Routes>
      </Router>
    </ToastProvider>
  )
}

export default App
