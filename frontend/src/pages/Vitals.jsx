import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Plus, Calendar, TrendingUp, Heart, Droplets, Weight, Thermometer, Gauge} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import LoadingSpinner from '../components/LoadingSpinner'
import axios from 'axios'

const Vitals = () => {
  const { t, isUrdu } = useLanguage()
  const [vitals, setVitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newVital, setNewVital] = useState({
    type: 'blood_pressure',
    value: { systolic: '', diastolic: '', reading: '', unit: '' },
    date: new Date().toISOString().split('T')[0],
    time: 'morning',
    notes: ''
  })
  useEffect(() => {
    fetchVitals()
  }, [])

  const fetchVitals = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/vitals')
      setVitals(response.data.vitals || [])
    } catch (error) {
      console.error('Error fetching vitals:', error)
      setVitals([])
    } finally {
      setLoading(false)
    } }
  const handleAddVital = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/vitals', newVital)
      setShowAddForm(false)
      setNewVital({
        type: 'blood_pressure',
        value: { systolic: '', diastolic: '', reading: '', unit: '' },
        date: new Date().toISOString().split('T')[0],
        time: 'morning',
        notes: ''
      })
      fetchVitals()
    } catch (error) {
      console.error('Error adding vital:', error)
    }
  }
  const vitalTypes = [
    { value: 'blood_pressure', label: isUrdu ? 'Blood Pressure' : 'Blood Pressure', icon: Heart, unit: 'mmHg' },
    { value: 'blood_sugar', label: isUrdu ? 'Blood Sugar' : 'Blood Sugar', icon: Droplets, unit: 'mg/dL' },
    { value: 'weight', label: isUrdu ? 'Weight' : 'Weight', icon: Weight, unit: 'kg' },
    { value: 'heart_rate', label: isUrdu ? 'Heart Rate' : 'Heart Rate', icon: Activity, unit: 'bpm' },
    { value: 'temperature', label: isUrdu ? 'Temperature' : 'Temperature', icon: Thermometer, unit: '°F' },
    { value: 'oxygen_saturation', label: isUrdu ? 'Oxygen Saturation' : 'Oxygen Saturation', icon: Gauge, unit: '%' }
  ]
  const getVitalIcon = (type) => {
    const vitalType = vitalTypes.find(v => v.value === type)
    return vitalType ? vitalType.icon : Activity
  }
  const getVitalLabel = (type) => {
    const vitalType = vitalTypes.find(v => v.value === type)
    return vitalType ? vitalType.label : type
  }
  if (loading) {
    return <LoadingSpinner text={isUrdu ? 'Vitals load ho rahe hain...' : 'Loading vitals...'} />
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8" >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {isUrdu ? 'Vital Signs' : 'Vital Signs'}
              </h1>
              <p className="text-lg text-gray-600">
                {isUrdu 
                  ? 'Apne vital signs track karein'
                  : 'Track your vital signs'}
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary mt-4 md:mt-0 flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>{isUrdu ? 'Add Vital' : 'Add Vital'}</span>
            </button>
          </div>
        </motion.div>
        {/* Add Vital Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {isUrdu ? 'New Vital Reading' : 'Add New Vital Reading'}
            </h2>
            <form onSubmit={handleAddVital} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isUrdu ? 'Vital Type' : 'Vital Type'}
                  </label>
                  <select
                    value={newVital.type}
                    onChange={(e) => setNewVital({ ...newVital, type: e.target.value })}
                    className="input-primary">
                    {vitalTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isUrdu ? 'Date' : 'Date'}
                  </label>
                  <input type="date" value={newVital.date}
                    onChange={(e) => setNewVital({ ...newVital, date: e.target.value })} className="input-primary"/>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isUrdu ? 'Time' : 'Time'}
                  </label>
                  <select
                    value={newVital.time}
                    onChange={(e) => setNewVital({ ...newVital, time: e.target.value })}
                    className="input-primary">
                    <option value="morning">{isUrdu ? 'Morning' : 'Morning'}</option>
                    <option value="afternoon">{isUrdu ? 'Afternoon' : 'Afternoon'}</option>
                    <option value="evening">{isUrdu ? 'Evening' : 'Evening'}</option>
                    <option value="night">{isUrdu ? 'Night' : 'Night'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isUrdu ? 'Reading' : 'Reading'}
                  </label>
                  {newVital.type === 'blood_pressure' ? (
                    <div className="flex space-x-2">
                      <input type="number" placeholder="120"
                        value={newVital.value.systolic}
                        onChange={(e) => setNewVital({
                          ...newVital,
                          value: { ...newVital.value, systolic: e.target.value }
                        })}
                        className="input-primary flex-1"/>
                      <span className="flex items-center text-gray-500">/</span>
                      <input type="number" placeholder="80" value={newVital.value.diastolic}
                        onChange={(e) => setNewVital({
                          ...newVital,
                          value: { ...newVital.value, diastolic: e.target.value }
                        })}
                        className="input-primary flex-1"/>
                    </div>
                  ) : (
                    <input type="number" step="0.1"  value={newVital.value.reading}
                      onChange={(e) => setNewVital({
                        ...newVital,
                        value: { ...newVital.value, reading: e.target.value } })}
                      className="input-primary"/>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isUrdu ? 'Notes' : 'Notes'}
                </label>
                <textarea value={newVital.notes} 
                  onChange={(e) => setNewVital({ ...newVital, notes: e.target.value })}
                  className="input-primary" rows="3" placeholder={isUrdu ? 'Additional notes...' : 'Additional notes...'}/>
              </div>

              <div className="flex space-x-4">
                <button1 type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn-ghost flex-1">
                  {isUrdu ? 'Cancel' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1">
                  {isUrdu ? 'Add Vital' : 'Add Vital'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Vitals Grid */}
        {vitals.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vitals.map((vital, index) => {
              const Icon = getVitalIcon(vital.type)
              return (
                <motion.div
                  key={vital._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card card-hover p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        vital.isNormal ? 'bg-green-100' : 'bg-orange-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          vital.isNormal ? 'text-green-600' : 'text-orange-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {getVitalLabel(vital.type)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(vital.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      vital.isNormal ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {vital.isNormal ? (isUrdu ? 'Normal' : 'Normal') : (isUrdu ? 'Abnormal' : 'Abnormal')}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-gray-900">
                      {vital.type === 'blood_pressure' 
                        ? `${vital.value.systolic}/${vital.value.diastolic} mmHg`
                        : `${vital.value.reading} ${vitalTypes.find(v => v.value === vital.type)?.unit || ''}`
                      }
                    </div>
                    <div className="text-sm text-gray-500">
                      {isUrdu ? 'Time:' : 'Time:'} {vital.time}
                    </div>
                    {vital.notes && (
                      <div className="text-sm text-gray-600">
                        {vital.notes}
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Activity className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isUrdu ? 'Koi vitals nahi hain' : 'No vitals recorded'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isUrdu 
                ? 'Apna pehla vital reading add karein'
                : 'Add your first vital reading'
              }
            </p>
            <button  onClick={() => setShowAddForm(true)}
              className="btn-primary inline-flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>{isUrdu ? 'Add Vital' : 'Add Vital'}</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )}
export default Vitals
