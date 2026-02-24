import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import React, { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";
import { 
  Phone, 
  MapPin, 
  AlertCircle, 
  Ambulance, 
  Clock,
  MessageSquare,
  Send,
  Mic
} from 'lucide-react'
import toast from 'react-hot-toast'

const EMERGENCY_TYPES = [
  { id: 'trauma', label: 'Trauma / Accident', icon: '🚗' },
  { id: 'medical', label: 'Medical Emergency', icon: '🫀' },
  { id: 'obstetric', label: 'Maternal / Obstetric', icon: '🤰' },
  { id: 'pediatric', label: 'Pediatric', icon: '👶' },
  { id: 'cardiac', label: 'Cardiac / Chest Pain', icon: '❤️' },
  { id: 'respiratory', label: 'Respiratory', icon: '🫁' },
  { id: 'other', label: 'Other Emergency', icon: '🆘' }
]

const AI_TRIAGE_KEYWORDS = {
  critical: ['unconscious', 'not breathing', 'cardiac arrest', 'severe bleeding', 'amepoteza fahamu', 'hapumui'],
  urgent: ['chest pain', 'difficulty breathing', 'stroke', 'kifua', 'kupumua kwa shida']
}

export default function Emergency() {
  const [liveEmergencies, setLiveEmergencies] = useState([]);
  const socketRef = useRef(null);
useEffect(() => {
  socketRef.current = io("http://localhost:5000")

  socketRef.current.on("newEmergency", (data) => {
    setLiveEmergencies(prev => [data, ...prev])
  })

  socketRef.current.on("vehicleUpdate", (updatedVehicle) => {
    setVehicles(prev =>
      prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v)
    )
  })

  return () => socketRef.current.disconnect()
}, [])

  const [step, setStep] = useState('type') // type, details, location, confirm, submitted
  const [formData, setFormData] = useState({
    emergency_type: '',
    caller_name: '',
    caller_phone: '',
    patient_name: '',
    chief_complaint: '',
    language: 'english',
    pickup_address: '',
    pickup_what3words: '',
    pickup_gps: null
  })
  const [triageResult, setTriageResult] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emergencyData, setEmergencyData] = useState(null)
  const navigate = useNavigate()

  // AI Triage simulation
  const performTriage = (text) => {
    const lowerText = text.toLowerCase()
    let severity = 'routine'
    const keywords = []

    Object.entries(AI_TRIAGE_KEYWORDS).forEach(([level, words]) => {
      words.forEach(word => {
        if (lowerText.includes(word)) {
          severity = level
          keywords.push(word)
        }
      })
    })

    return {
      severity,
      confidence: keywords.length > 0 ? 0.85 : 0.5,
      keywords,
      estimatedResponse: severity === 'critical' ? '< 15 mins' : severity === 'urgent' ? '< 25 mins' : '< 40 mins'
    }
  }

  const handleComplaintChange = (value) => {
    setFormData({ ...formData, chief_complaint: value })
    if (value.length > 10) {
      setTriageResult(performTriage(value))
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            pickup_gps: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          })
          toast.success('Location captured successfully')
        },
        () => toast.error('Could not get location. Please enter manually.')
      )
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const { data } = await api.post('/emergencies', {
        ...formData,
        access_method: 'web'
      })
      
      setEmergencyData(data.emergency)
      setStep('submitted')
      toast.success('Emergency request submitted!')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to submit emergency')
    }
    setIsSubmitting(false)
  }

  const renderStep = () => {
    switch (step) {
      case 'type':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What type of emergency?</h2>
              <p className="text-gray-600">Select the category that best describes the situation</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {EMERGENCY_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setFormData({ ...formData, emergency_type: type.id })
                    setStep('details')
                  }}
                  className="p-6 rounded-2xl border-2 border-gray-200 hover:border-ems-navy hover:bg-ems-navy/5 transition-all text-center group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{type.icon}</div>
                  <div className="font-medium text-gray-900">{type.label}</div>
                </button>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Can't determine the type?</p>
              <button 
                onClick={() => {
                  setFormData({ ...formData, emergency_type: 'other' })
                  setStep('details')
                }}
                className="text-ems-navy font-medium hover:underline"
              >
                Continue with general emergency
              </button>
            </div>
          </div>
        )

      case 'details':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Emergency Details</h2>
              <p className="text-gray-600">Provide information about the patient and situation</p>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.caller_name}
                    onChange={(e) => setFormData({ ...formData, caller_name: e.target.value })}
                    className="input-field"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.caller_phone}
                    onChange={(e) => setFormData({ ...formData, caller_phone: e.target.value })}
                    className="input-field"
                    placeholder="07XX XXX XXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name (if different)</label>
                <input
                  type="text"
                  value={formData.patient_name}
                  onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                  className="input-field"
                  placeholder="Patient's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Describe the Emergency *</label>
                <div className="relative">
                  <textarea
                    required
                    rows={4}
                    value={formData.chief_complaint}
                    onChange={(e) => handleComplaintChange(e.target.value)}
                    className="input-field resize-none"
                    placeholder="Describe what happened, symptoms, and current condition..."
                  />
                  <button 
                    type="button"
                    className="absolute bottom-3 right-3 p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    title="Voice input (coming soon)"
                  >
                    <Mic className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                
                {/* AI Triage Result */}
                {triageResult && (
                  <div className={`mt-3 p-4 rounded-xl ${
                    triageResult.severity === 'critical' ? 'bg-red-50 border border-red-200' :
                    triageResult.severity === 'urgent' ? 'bg-orange-50 border border-orange-200' :
                    'bg-green-50 border border-green-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className={`w-5 h-5 ${
                        triageResult.severity === 'critical' ? 'text-red-600' :
                        triageResult.severity === 'urgent' ? 'text-orange-600' :
                        'text-green-600'
                      }`} />
                      <span className="font-semibold capitalize">{triageResult.severity} Priority</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Estimated response time: <span className="font-semibold">{triageResult.estimatedResponse}</span>
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="input-field"
                >
                  <option value="english">English</option>
                  <option value="swahili">Kiswahili</option>
                  <option value="sheng">Sheng</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('type')} className="flex-1 btn-secondary">
                Back
              </button>
              <button 
                onClick={() => setStep('location')}
                disabled={!formData.caller_name || !formData.caller_phone || !formData.chief_complaint}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )

      case 'location':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pickup Location</h2>
              <p className="text-gray-600">Help us find you quickly</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={getCurrentLocation}
                className="w-full p-4 bg-ems-navy/5 border-2 border-dashed border-ems-navy/30 rounded-xl hover:border-ems-navy transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="w-5 h-5 text-ems-navy" />
                <span className="font-medium text-ems-navy">Use My Current Location</span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or enter manually</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address / Landmark *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.pickup_address}
                  onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
                  className="input-field resize-none"
                  placeholder="e.g., Near KCB Bank, Main Street, opposite the market"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">what3words Address (Optional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.pickup_what3words}
                    onChange={(e) => setFormData({ ...formData, pickup_what3words: e.target.value })}
                    className="input-field flex-1"
                    placeholder="e.g., reeds.market.ambulance"
                  />
                  <button 
                    type="button"
                    className="px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 text-sm font-medium"
                  >
                    Find
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  what3words helps us locate you precisely in rural areas
                </p>
              </div>

              {/* Mini Map */}
              {formData.pickup_gps && (
                <div className="h-48 rounded-xl overflow-hidden border">
                  <MapContainer 
                    center={[formData.pickup_gps.lat, formData.pickup_gps.lng]} 
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[formData.pickup_gps.lat, formData.pickup_gps.lng]}>
                      <Popup>Pickup Location</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('details')} className="flex-1 btn-secondary">
                Back
              </button>
              <button 
                onClick={() => setStep('confirm')}
                disabled={!formData.pickup_address}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                Review & Submit
              </button>
            </div>
          </div>
        )

      case 'confirm':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Details</h2>
              <p className="text-gray-600">Review before submitting</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Emergency Type</span>
                <span className="font-medium capitalize">{formData.emergency_type}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Caller</span>
                <span className="font-medium">{formData.caller_name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Phone</span>
                <span className="font-medium">{formData.caller_phone}</span>
              </div>
              <div className="py-2 border-b border-gray-200">
                <span className="text-gray-600 block mb-1">Description</span>
                <span className="font-medium text-sm">{formData.chief_complaint}</span>
              </div>
              <div className="py-2 border-b border-gray-200">
                <span className="text-gray-600 block mb-1">Location</span>
                <span className="font-medium text-sm">{formData.pickup_address}</span>
              </div>
              {triageResult && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Priority Level</span>
                  <span className={`font-medium capitalize ${
                    triageResult.severity === 'critical' ? 'text-red-600' :
                    triageResult.severity === 'urgent' ? 'text-orange-600' :
                    'text-green-600'
                  }`}>{triageResult.severity}</span>
                </div>
              )}
            </div>

            <div className="bg-ems-danger/10 border border-ems-danger/20 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-ems-danger flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-medium text-ems-danger mb-1">Important</p>
                <p>Submitting false emergency reports is a criminal offense. Only proceed if this is a genuine emergency.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('location')} className="flex-1 btn-secondary">
                Back
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 btn-danger flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Emergency Request
                  </>
                )}
              </button>
            </div>
          </div>
        )

      case 'submitted':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Ambulance className="w-10 h-10 text-green-600" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Emergency Submitted!</h2>
              <p className="text-gray-600">
                Your request number is <span className="font-bold text-ems-navy">{emergencyData?.request_number}</span>
              </p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Estimated Response: {emergencyData?.estimated_response_time}</span>
              </div>
              <p className="text-sm text-gray-600">
                Stay calm. Help is on the way. Keep your phone line open.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate(`/emergency/${emergencyData?.id}`)}
                className="w-full max-w-md btn-primary"
              >
                Track Response
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full max-w-md btn-secondary"
              >
                Report Another Emergency
              </button>
            </div>

            <div className="text-sm text-gray-500">
              <p>Emergency hotline: <a href="tel:719" className="font-bold text-ems-navy">719</a></p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-red-50 to-orange-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Emergency Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-ems-danger/10 text-ems-danger rounded-full text-sm font-medium mb-4">
            <AlertCircle className="w-4 h-4" />
            Emergency Request
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Request Emergency Help</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {['type', 'details', 'location', 'confirm'].map((s, idx) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s ? 'bg-ems-danger text-white' :
                ['submitted'].includes(step) || ['details', 'location', 'confirm'].includes(step) && idx < ['type', 'details', 'location', 'confirm'].indexOf(step) + 1
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {idx + 1}
              </div>
              {idx < 3 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  ['details', 'location', 'confirm', 'submitted'].includes(step) && idx < ['type', 'details', 'location', 'confirm'].indexOf(step) + 1
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Main Card */}
        <div className="card">
          {renderStep()}
        </div>

        {/* USSD Fallback */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Can't use the app?{' '}
            <span className="font-bold text-ems-navy">Dial *123#</span> on any phone
          </p>
        </div>
      </div>
    </div>
  )
}