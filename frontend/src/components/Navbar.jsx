import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {  Menu, X, User, LogOut,  Settings, Heart, FileText, Activity, , Home} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import LanguageToggle from './LanguageToogle'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const { t, isUrdu } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setIsProfileOpen(false)
  }
  const navItems = [
    { path: '/', label: t('home'), icon: Home },
    { path: '/dashboard', label: t('dashboard'), icon: Heart, protected: true },
    { path: '/reports', label: t('reports'), icon: FileText, protected: true },
    { path: '/vitals', label: t('vitals'), icon: Activity, protected: true },]

  const isActive = (path) => location.pathname === path
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b glass border-white/20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
        
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center justify-center w-10 h-10 rounded-lg gradient-primary" >
              <Heart className="w-6 h-6 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gradient">
                HealthMate
              </span>
              <span className="-mt-1 text-xs text-gray-500">
                {isUrdu ? 'Sehat ka Smart Dost' : 'Sehat ka Smart Dost'}
              </span>
            </div>
          </Link>
          <div className="items-center hidden space-x-8 md:flex">
            {navItems.map((item) => {
              if (item.protected && !isAuthenticated) return null
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}>
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
        
             <div className="p-2 transition-all duration-300 border rounded-lg bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30">
              <LanguageToggle />
            </div>
            {isAuthenticated ? (
              /* User Profile Dropdown */
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center p-2 space-x-2 transition-all duration-300 border rounded-lg bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30" >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="object-cover w-8 h-8 rounded-full"/>
                  ) : (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-500">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="hidden font-medium text-gray-700 sm:block">
                    {user?.name}
                  </span>
                </motion.button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 w-48 py-2 mt-2 border rounded-lg shadow-lg glass border-white/20">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-2 space-x-2 text-gray-700 transition-colors hover:bg-white/20">
                        <Settings className="w-4 h-4" />
                        <span>{t('profile')}</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 space-x-2 text-gray-700 transition-colors hover:bg-white/20" >
                        <LogOut className="w-4 h-4" />
                        <span>{t('logout')}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Login/Register Buttons */
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm btn-ghost">
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="text-sm btn-primary">
                  {t('register')}
                </Link>
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 transition-all duration-300 border rounded-lg md:hidden bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30">
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </motion.button>
          </div>
        </div>
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 overflow-hidden border rounded-lg md:hidden glass border-white/20" >
              <div className="px-4 py-2 space-y-1">
                {navItems.map((item) => {
                  if (item.protected && !isAuthenticated) return null
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                        isActive(item.path)
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                      }`}>
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )}
export default Navbar