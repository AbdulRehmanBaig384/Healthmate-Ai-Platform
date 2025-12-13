import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Globe, Lock, Save, Eye, EyeOff, Camera} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import LoadingSpinner from '../components/LoadingSpinner'

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth()
  const { t, isUrdu, toggleLanguage } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    language: user?.language || 'en',
    avatar: user?.avatar || ''
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await updateProfile(profileData)
    } catch (error) {
      console.error('Profile update error:', error)
    } finally {
      setLoading(false)
    }
  }
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert(isUrdu ? 'New passwords match nahi kar rahe' : 'New passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 6) {
      alert(isUrdu ? 'New password kam se kam 6 characters ka hona chahiye' : 'New password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword})
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })}
       catch (error) {
      console.error('Password change error:', error)}
       finally {
      setLoading(false)
    }
  }
  const tabs = [
    { id: 'profile', label: isUrdu ? 'Profile Settings' : 'Profile Settings', icon: User },
    { id: 'password', label: isUrdu ? 'Change Password' : 'Change Password', icon: Lock }
  ]
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8" >
          <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
            {isUrdu ? 'Profile Settings' : 'Profile Settings'}
          </h1>
          <p className="text-lg text-gray-600">
            {isUrdu 
              ? 'Apna profile manage karein'
              : 'Manage your profile settings'
            }
          </p>
        </motion.div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1" >
            <div className="p-6 card">
              <div className="mb-6 text-center">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-primary-100">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="object-cover w-20 h-20 rounded-full" />
                  ) : (
                    <User className="w-10 h-10 text-primary-600" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`} >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="p-6 card">
                <h2 className="mb-6 text-xl font-semibold text-gray-900">
                  {isUrdu ? 'Profile Information' : 'Profile Information'}
                </h2>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      {isUrdu ? 'Profile Picture' : 'Profile Picture'}
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="object-cover w-16 h-16 rounded-full"/>
                        ) : (
                          <User className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <button
                        type="button"
                        className="flex items-center space-x-2 btn-secondary" >
                        <Camera className="w-4 h-4" />
                        <span>{isUrdu ? 'Change Picture' : 'Change Picture'}</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                      {t('name')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <input type="text" id="name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="pl-10 input-primary" required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                      {t('email')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="w-5 h-5 text-gray-400" />
                      </div>
                      <input type="email" id="email" value={profileData.email} disabled className="pl-10 input-primary bg-gray-50"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {isUrdu ? 'Email change nahi kar sakte' : 'Email cannot be changed'}
                    </p>
                  </div>
                  <div>
                    <label htmlFor="language" className="block mb-2 text-sm font-medium text-gray-700">
                      {t('language')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Globe className="w-5 h-5 text-gray-400" />
                      </div>
                      <select
                        id="language"
                        value={profileData.language}
                        onChange={(e) => {
                          setProfileData({ ...profileData, language: e.target.value })
                          toggleLanguage()
                        }}
                        className="pl-10 input-primary">
                        <option value="en">English</option>
                        <option value="ur">Roman Urdu</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center space-x-2 btn-primary disabled:opacity-50">
                      <Save className="w-4 h-4" />
                      <span>{isUrdu ? 'Save Changes' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
            {activeTab === 'password' && (
              <div className="p-6 card">
                <h2 className="mb-6 text-xl font-semibold text-gray-900">
                  {isUrdu ? 'Change Password' : 'Change Password'}
                </h2>
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="block mb-2 text-sm font-medium text-gray-700">
                      {t('currentPassword')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input type={showCurrentPassword ? 'text' : 'password'} id="currentPassword" value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="pl-10 pr-10 input-primary" required />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)} >
                        {showCurrentPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-700">
                      {t('newPassword')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input  type={showPassword ? 'text' : 'password'}  id="newPassword"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="pl-10 pr-10 input-primary"
                        required />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)} >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
                      {isUrdu ? 'Confirm New Password' : 'Confirm New Password'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="pl-10 input-primary"
                        required />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" disabled={loading}
                      className="flex items-center space-x-2 btn-primary disabled:opacity-50">
                      <Lock className="w-4 h-4" />
                      <span>{isUrdu ? 'Change Password' : 'Change Password'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>)}
export default Profile
