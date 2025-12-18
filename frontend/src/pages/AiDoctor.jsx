import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Brain, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const AIDoctor = () => {
  const { user } = useAuth()
  const { isUrdu } = useLanguage()

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      from: 'ai',
      text: isUrdu
        ? `Assalam-o-Alaikum ${user?.name}, main aap ka AI Doctor hoon. Apni health problem ya report ke baare mein pooch sakte hain.`
        : `Hello ${user?.name}, I am your AI Doctor. You can ask me about your health issues or reports.`
    }])
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!message.trim() || loading) return

    const userMessage = message.trim()
    setMessages(prev => [
      ...prev,
      { from: 'user', text: userMessage }
    ])
    setMessage('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('/api/ai/chat', {
        message: userMessage
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setMessages(prev => [
        ...prev,
        { from: 'ai', text: response.data.reply }
      ])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = error.response?.data?.message || (isUrdu ? 'Chat error' : 'Chat error')
      toast.error(errorMessage)
      setMessages(prev => [
        ...prev,
        { from: 'ai', text: isUrdu ? 'Maaf kijiye, abhi jawab nahi de sakta. Please try again.' : 'Sorry, I cannot respond right now. Please try again.' }
      ])
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl px-4 py-6 mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/dashboard">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isUrdu ? 'AI Doctor Chat' : 'AI Doctor Chat'}
          </h1>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col h-[70vh]">
          <div className="flex-1 mb-4 space-y-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-xl text-sm ${
                    msg.from === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}
              placeholder={
                isUrdu
                  ? 'Apna sawal likhein...'
                  : 'Type your question...'}
              className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <button
              onClick={handleSend}
              disabled={loading}
              className="p-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
        <p className="mt-4 text-xs text-center text-gray-500">
          {isUrdu
            ? 'AI Doctor sirf rehnumai ke liye hai. Emergency mein doctor se rabta karein.'
            : 'AI Doctor is for guidance only. Consult a real doctor in emergencies.'}
        </p>
      </div>
    </div>
  )}
export default AIDoctor
