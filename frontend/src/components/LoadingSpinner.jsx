import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'}
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
        }}
        className={`${sizeClasses[size]} gradient-primary rounded-full flex items-center justify-center`} >
        <Heart className="w-1/2 text-white h-1/2" />
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="font-medium text-gray-600">
        {text}
      </motion.p>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="h-1 max-w-xs rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"/>
    </div>
  )
}
export default LoadingSpinner
