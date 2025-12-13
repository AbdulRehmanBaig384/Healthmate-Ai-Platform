import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Heart, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import LoadingSpinner from '../components/LoadingSpinner'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const { t, isUrdu } = useLanguage()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(formData.email, formData.password)
      if (result.success) {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner text={isUrdu ? 'Login ho raha hai...' : 'Logging in...'} />
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute w-32 h-32 rounded-full top-20 left-10 bg-primary-200/30 blur-xl" />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute w-40 h-40 rounded-full bottom-20 right-10 bg-secondary-200/30 blur-xl" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center" >
          <div className="flex justify-center mb-6">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center justify-center w-16 h-16 gradient-primary rounded-2xl" >
              <Heart className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            {isUrdu ? 'Welcome Back!' : 'Welcome Back!'}
          </h2>
          <p className="text-gray-600">
            {isUrdu 
              ? 'Apne account mein login karein'
              : 'Sign in to your account'
            }
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                {t('email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange}
                  className="pl-10 input-primary"
                  placeholder={isUrdu ? 'apna@email.com' : 'your@email.com'}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                {t('password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input id="password" name="password"
                  type={showPassword ? 'text' : 'password'} autoComplete="current-password"
                  required value={formData.password}
                  onChange={handleChange}  className="pl-10 pr-10 input-primary"
                  placeholder={isUrdu ? 'Password enter karein' : 'Enter your password'} />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="w-4 h-4 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-700">
                  {t('rememberMe')}
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  {t('forgotPassword')}
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex items-center justify-center w-full space-x-2 btn-primary group">
              <span>{isUrdu ? 'Login Karein' : 'Sign In'}</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-white">
                  {isUrdu ? 'Ya' : 'Or'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('dontHaveAccount')}{' '}
              <Link
                to="/register"
                className="font-medium transition-colors text-primary-600 hover:text-primary-500" >
                {t('signUp')}
              </Link>
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 border border-blue-200 card bg-blue-50">
          <h3 className="mb-2 text-sm font-medium text-blue-800">
            {isUrdu ? 'Demo Credentials:' : 'Demo Credentials:'}
          </h3>
          <div className="space-y-1 text-xs text-blue-700">
            <p><strong>Email:</strong> demo@healthmate.com</p>
            <p><strong>Password:</strong> demo123</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
export default Login
