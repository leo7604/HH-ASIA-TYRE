import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import BookingPage from './pages/BookingPage'
import ConfirmationPage from './pages/ConfirmationPage'
import { usePageViews } from './hooks/useAnalytics'

function AnalyticsWrapper() {
  usePageViews()
  return null
}

function App() {
  return (
    <Router>
      <AnalyticsWrapper />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
      </Routes>
    </Router>
  )
}

export default App
