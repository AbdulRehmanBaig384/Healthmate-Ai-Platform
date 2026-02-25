import { Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from './context/AuthContext'
import { useLanguage } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingSpinner from './components/LoadingSpinner'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import Vitals from './pages/Vitals'
import Profile from './pages/Profile'
import UploadReport from './pages/UploadReport'
import ReportDetail from './pages/ReportDetail'
import AIDoctor from './pages/AiDoctor'
// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  return user ? children : <Navigate to="/login" replace />
}
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <LoadingSpinner />
}  
  return user ? <Navigate to="/dashboard" replace /> : children}
function App() {
  const { language } = useLanguage()

  return (
    <div className={`min-h-screen ${language === 'ur' ? 'font-urdu' : 'font-sans'}`}>
      <Navbar />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }  />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
          
          {/* Protected Routes */}
          <Route 
   path="/ai-doctor" 
  element={
    <ProtectedRoute>
      <AIDoctor />
    </ProtectedRoute>
  } 
/>

          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }/>
          <Route 
            path="/reports/upload" 
            element={
              <ProtectedRoute>
                <UploadReport />
              </ProtectedRoute>
            }/>
          <Route 
            path="/reports/:id" 
            element={
              <ProtectedRoute>
                <ReportDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vitals" 
            element={
              <ProtectedRoute>
                <Vitals />
              </ProtectedRoute>
            }/>
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.main>
      
      <Footer />
    </div>
  )
}

export default App
