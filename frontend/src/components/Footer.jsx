import {motion} from 'framer-motion'
import {Heart,Mail,Phone,MapPin} from 'lucide-react'
import {useLanguage} from '../context/LanguageContext'

const Footer = () => {
  const {t,isUrdu} = useLanguage()
  
  return (
    <motion.footer 
      initial={{opacity: 0}}
      whileInView={{opacity: 1}}
      className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white mt-20" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{y:20,opacity:0}}
              whileInView={{y:0,opacity:1}}
              className="flex items-center space-x-3 mb-4" >
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">HealthMate</h3>
                <p className="text-white/80 text-sm">
                  {isUrdu?'Sehat ka Smart Dost':'Sehat ka Smart Dost'}
                </p>
              </div>
            </motion.div>
            <motion.p
              initial={{y:20, opacity:0}}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-white/80 mb-6 max-w-md" >
              {isUrdu 
                ? 'AI-powered health companion jo aapke medical reports ko analyze karta hai aur health tips deta hai.'
                : 'AI-powered health companion that analyzes your medical reports and provides health insights.'
              }
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-white/60">
              <p className="mb-2">
                <strong>{isUrdu ? 'Disclaimer:' : 'Disclaimer:'}</strong>
              </p>
              <p>
                {t('disclaimer')}
              </p>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}  >
            <h4 className="text-lg font-semibold mb-4">
              {isUrdu ? 'Quick Links' : 'Quick Links'}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-white/80 hover:text-white transition-colors">
                  {t('home')}
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-white/80 hover:text-white transition-colors">
                  {t('dashboard')}
                </a>
              </li>
              <li>
                <a href="/reports" className="text-white/80 hover:text-white transition-colors">
                  {t('reports')}
                </a>
              </li>
              <li>
                <a href="/vitals" className="text-white/80 hover:text-white transition-colors">
                  {t('vitals')}
                </a>
              </li>
            </ul>
          </motion.div>
{/* contact Informaation  */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}>
            
            <h4 className="text-lg font-semibold mb-4">
              {isUrdu ? 'Contact' : 'Contact'}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-white/80" />
                <span className="text-white/80">support@healthmate.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-white/80" />
                <span className="text-white/80">+92 300 1234567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-white/80" />
                <span className="text-white/80">
                  {isUrdu ? 'Karachi, Pakistan' : 'Karachi, Pakistan'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
        {/* Bottom Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/80 text-sm">
            © 2024 HealthMate. {isUrdu ? 'Sab rights reserved.' : 'All rights reserved.'}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">
              {isUrdu ? 'Privacy Policy' : 'Privacy Policy'}
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">
              {isUrdu ? 'Terms of Service' : 'Terms of Service'}
            </a>
          </div>
        </motion.div>
      </div>
    </motion.footer>)}
export default Footer
