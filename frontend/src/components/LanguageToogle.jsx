import {useState,useRef,useEffect} from 'react'
import {Globe} from 'lucide-react'
import {motion,AnimatePresence} from 'framer-motion'
import {useLanguage} from '../context/LanguageContext'

const LanguageToggle=()=>{
  const {language,setLanguage}=useLanguage()
  const [open,setOpen]=useState(false)
  const ref=useRef(null)
  useEffect(()=>{
    const handleClickOutside=(e)=>{
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }}
    document.addEventListener('mousedown',handleClickOutside)
    return ()=>document.removeEventListener('mousedown',handleClickOutside)
  }, [])

  const changeLanguage = (lang) => {
    setLanguage(lang)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 transition rounded-lg hover:bg-gray-100"
        title="Change language">
        <Globe className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute right-0 z-50 mt-2 bg-white border shadow-lg w-36 rounded-xl">
            <button
              onClick={() => changeLanguage('en')}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                language === 'en' && 'font-semibold'
              }`}>
              🇬🇧 English
            </button>

            <button
              onClick={() => changeLanguage('ur')}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                language === 'ur' && 'font-semibold'
              }`}>
              🇵🇰 اردو
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )}
export default LanguageToggle
