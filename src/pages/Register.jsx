import React from "react"
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  Eye, 
  EyeOff,
  CheckCircle,
  Ambulance
} from 'lucide-react'
import toast from 'react-hot-toast'

const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
  'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
  'Nairobi City', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia',
  'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
]

const steps = [
  { id: 'account', title: 'Account' },
  { id: 'personal', title: 'Personal' },
  { id: 'complete', title: 'Complete' }
]

export default function Register() {
  const [currentStep, setCurrentStep] = useState('account')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    county: '',
    id_number: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    blood_type: '',
    allergies: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const register = useAuthStore(state => state.register)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)
    
    const { confirmPassword, ...registerData } = formData
    const result = await register(registerData)
    
    if (result.success) {
      toast.success('Account created successfully!')
      navigate('/subscription')
    } else {
      toast.error(result.error)
    }
    
    setIsLoading(false)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'account':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field pl-12"
                  placeholder="Rolex Ochieng"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-12"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field pl-12"
                  placeholder="07XX XXX XXX"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Format: 07XX XXX XXX or +254 7XX XXX XXX</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-12 pr-12"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input-field"
                placeholder="Confirm your password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'patient' })}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    formData.role === 'patient'
                      ? 'border-ems-navy bg-ems-navy/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <User className="w-6 h-6 mx-auto mb-2 text-ems-navy" />
                  <div className="font-medium">Patient</div>
                  <div className="text-xs text-gray-500">Emergency coverage</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'provider' })}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    formData.role === 'provider'
                      ? 'border-ems-navy bg-ems-navy/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Ambulance className="w-6 h-6 mx-auto mb-2 text-ems-navy" />
                  <div className="font-medium">Provider</div>
                  <div className="text-xs text-gray-500">EMS service provider</div>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep('personal')}
              className="w-full btn-primary"
            >
              Continue
            </button>
          </div>
        )

      case 'personal':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">County *</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  required
                  value={formData.county}
                  onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                  className="input-field pl-12 appearance-none"
                >
                  <option value="">Select your county</option>
                  {KENYA_COUNTIES.map(county => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
              <input
                type="text"
                value={formData.id_number}
                onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
                className="input-field"
                placeholder="National ID or Passport"
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Emergency Contact</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.emergency_contact_name}
                  onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                  className="input-field"
                  placeholder="Contact Name"
                />
                <input
                  type="tel"
                  value={formData.emergency_contact_phone}
                  onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                  className="input-field"
                  placeholder="Contact Phone"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Medical Information (Optional)</h4>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={formData.blood_type}
                  onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                  className="input-field"
                >
                  <option value="">Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="input-field"
                  placeholder="Known Allergies"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep('account')}
                className="flex-1 btn-secondary"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep === step.id
                  ? 'bg-ems-navy text-white'
                  : idx < steps.findIndex(s => s.id === currentStep)
                  ? 'bg-ems-accent text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {idx < steps.findIndex(s => s.id === currentStep) ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  idx + 1
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                currentStep === step.id ? 'text-ems-navy' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
              {idx < steps.length - 1 && (
                <div className="w-12 h-0.5 mx-4 bg-gray-200"></div>
              )}
            </div>
          ))}
        </div>

        <div className="card">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
            <p className="text-gray-600 mt-1">
              {currentStep === 'account' ? 'Start with your basic information' : 'Tell us more about yourself'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {renderStep()}
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-ems-navy font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}