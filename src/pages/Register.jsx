import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
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
  'Baringo','Bomet','Bungoma','Busia','Elgeyo-Marakwet','Embu','Garissa',
  'Homa Bay','Isiolo','Kajiado','Kakamega','Kericho','Kiambu','Kilifi',
  'Kirinyaga','Kisii','Kisumu','Kitui','Kwale','Laikipia','Lamu','Machakos',
  'Makueni','Mandera','Marsabit','Meru','Migori','Mombasa','Murang\'a',
  'Nairobi City','Nakuru','Nandi','Narok','Nyamira','Nyandarua','Nyeri',
  'Samburu','Siaya','Taita-Taveta','Tana River','Tharaka-Nithi','Trans Nzoia',
  'Turkana','Uasin Gishu','Vihiga','Wajir','West Pokot'
]

const steps = [
  { id: 'account', title: 'Account' },
  { id: 'personal', title: 'Personal' }
]

export default function Register() {

  const [currentStep, setCurrentStep] = useState('account')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    county: '',
    id_number: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const register = useAuthStore(state => state.register)
  const navigate = useNavigate()

  const normalizePhone = (phone) => {
    if (!phone) return '+254700000000'

    if (phone.startsWith('+254')) return phone

    return '+254' + phone.replace(/^0/, '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      if (currentStep !== 'personal') {
        toast.error("Complete all registration steps")
        return
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match")
        return
      }

      setIsLoading(true)

      const nameParts = formData.name.trim().split(' ')

      const registerData = {
        email: formData.email.trim(),
        password: formData.password,

        firstName: nameParts[0] || 'User',
        lastName: nameParts.slice(1).join(' ') || 'User',

        phone: normalizePhone(formData.phone),

        idNumber: /^\d{8}$/.test(formData.id_number)
          ? formData.id_number
          : '12345678'
      }

      const result = await register(registerData)

      if (result.success) {
        toast.success("Account created successfully")
        navigate('/subscription')
      } else {
        toast.error(result.error || "Registration failed")
      }

    } catch (error) {
      console.error(error)
      toast.error("Unexpected registration error")

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">

      <div className="max-w-lg mx-auto">

        {/* Progress Steps */}
        <div className="flex justify-center mb-8 gap-6">
          {steps.map(step => (
            <div key={step.id}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                currentStep === step.id
                  ? "bg-blue-900 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step.title}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow p-6">

          <h1 className="text-2xl font-bold text-center mb-2">
            Create Account
          </h1>

          <p className="text-gray-500 text-center mb-6">
            {currentStep === 'account'
              ? "Start with basic information"
              : "Complete your profile"}
          </p>

          <form onSubmit={handleSubmit}>

            {currentStep === 'account' && (

              <div className="space-y-4">

                <input
                  placeholder="Full Name"
                  className="input-field w-full"
                  value={formData.name}
                  onChange={e =>
                    setFormData({...formData, name:e.target.value})
                  }
                  required
                />

                <input
                  type="email"
                  placeholder="Email"
                  className="input-field w-full"
                  value={formData.email}
                  onChange={e =>
                    setFormData({...formData, email:e.target.value})
                  }
                  required
                />

                <input
                  placeholder="Phone (07XXXXXXXX)"
                  className="input-field w-full"
                  value={formData.phone}
                  onChange={e =>
                    setFormData({...formData, phone:e.target.value})
                  }
                  required
                />

                <div className="relative">

                  <input
                    type={showPassword ? "text":"password"}
                    placeholder="Password"
                    className="input-field w-full pr-12"
                    value={formData.password}
                    onChange={e =>
                      setFormData({...formData, password:e.target.value})
                    }
                    required
                    minLength={8}
                  />

                  <button
                    type="button"
                    onClick={()=>setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 text-gray-400"
                  >
                    {showPassword ? <EyeOff/> : <Eye/>}
                  </button>

                </div>

                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="input-field w-full"
                  value={formData.confirmPassword}
                  onChange={e =>
                    setFormData({...formData, confirmPassword:e.target.value})
                  }
                  required
                />

                <button
                  type="button"
                  className="w-full btn-primary"
                  onClick={()=>setCurrentStep('personal')}
                >
                  Continue
                </button>

              </div>
            )}

            {currentStep === 'personal' && (

              <div className="space-y-4">

                <select
                  className="input-field w-full"
                  value={formData.county}
                  onChange={e =>
                    setFormData({...formData, county:e.target.value})
                  }
                >
                  <option value="">Select County</option>
                  {KENYA_COUNTIES.map(c=>(
                    <option key={c}>{c}</option>
                  ))}
                </select>

                <input
                  placeholder="ID Number (8 digits)"
                  className="input-field w-full"
                  value={formData.id_number}
                  onChange={e =>
                    setFormData({...formData, id_number:e.target.value})
                  }
                />

                <div className="flex gap-3">

                  <button
                    type="button"
                    className="btn-secondary flex-1"
                    onClick={()=>setCurrentStep('account')}
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary flex-1 flex justify-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                    ) : (
                      <>
                        Create Account
                        <CheckCircle/>
                      </>
                    )}
                  </button>

                </div>

              </div>
            )}

          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            Already have account?
            <Link to="/login" className="text-blue-900 ml-1">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}