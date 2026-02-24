import { useState, useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import api from '../services/api'
import { 
  Check, 
  HeartPulse, 
  Users, 
  Building2, 
  User,
  Shield,
  Clock,
  MapPin,
  CreditCard
} from 'lucide-react'
import toast from 'react-hot-toast'

const plans = [
  {
    id: 'individual',
    name: 'Individual',
    icon: User,
    description: 'For individuals and families',
    tiers: {
      basic: { price: 4000, trips: 4, limit: 100000 },
      standard: { price: 8000, trips: 8, limit: 250000 },
      premium: { price: 15000, trips: 15, limit: 500000 }
    }
  },
  {
    id: 'family',
    name: 'Family',
    icon: Users,
    description: 'Cover up to 4 family members',
    tiers: {
      basic: { price: 8000, trips: 4, limit: 100000 },
      standard: { price: 15000, trips: 8, limit: 250000 },
      premium: { price: 25000, trips: 15, limit: 500000 }
    }
  },
  {
    id: 'sacco',
    name: 'SACCO/Group',
    icon: Building2,
    description: 'For chamas and cooperatives',
    tiers: {
      basic: { price: 35000, trips: 20, limit: 500000 },
      standard: { price: 60000, trips: 40, limit: 1000000 },
      premium: { price: 100000, trips: 80, limit: 2000000 }
    }
  }
]

const features = {
  basic: [
    '4 ambulance trips per year',
    'Basic Life Support (BLS)',
    'County-wide coverage',
    'USSD (*123#) access',
    'SMS notifications',
    'Standard response time'
  ],
  standard: [
    '8 ambulance trips per year',
    'Advanced Life Support (ALS)',
    'Multi-county coverage',
    'Priority dispatch',
    'Mobile app access',
    'GPS tracking',
    'Family add-on (2 members)',
    'Oxygen therapy included'
  ],
  premium: [
    '15 ambulance trips per year',
    'ALS + Air ambulance',
    'National coverage',
    'VIP dispatch priority',
    'Mobile app + USSD',
    'Real-time tracking',
    'Family add-on (4 members)',
    'Oxygen & advanced equipment',
    'Direct SHA billing',
    '24/7 concierge'
  ]
}

export default function Subscription() {
  const { user } = useAuthStore()
  const [selectedPlan, setSelectedPlan] = useState('individual')
  const [selectedTier, setSelectedTier] = useState('basic')
  const [activeSubscription, setActiveSubscription] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  useEffect(() => {
    fetchActiveSubscription()
  }, [])

  const fetchActiveSubscription = async () => {
    try {
      const { data } = await api.get('/subscriptions/active')
      setActiveSubscription(data.subscription)
    } catch (error) {
      // No active subscription
    }
  }

  const handleSubscribe = async () => {
    setIsLoading(true)
    try {
      const { data } = await api.post('/subscriptions', {
        plan_type: selectedPlan,
        tier: selectedTier,
        payment_method: 'mpesa',
        coverage_county: user?.county || 'Nairobi City'
      })
      
      if (data.payment_instructions) {
        setShowPayment(true)
        toast.success('Please complete M-Pesa payment on your phone')
      } else {
        toast.success('Subscription activated!')
        fetchActiveSubscription()
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create subscription')
    }
    setIsLoading(false)
  }

  if (activeSubscription) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card bg-gradient-to-br from-ems-accent/10 to-blue-50 border-ems-accent/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-ems-accent rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Active Subscription</h1>
              <p className="text-gray-600">You're covered for emergencies</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-1">Plan</div>
              <div className="text-lg font-bold capitalize">{activeSubscription.plan_type}</div>
              <div className="text-sm text-ems-accent font-medium capitalize">{activeSubscription.tier}</div>
            </div>
            <div className="bg-white rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-1">Valid Until</div>
              <div className="text-lg font-bold">
                {new Date(activeSubscription.end_date).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-500">
                {Math.ceil((new Date(activeSubscription.end_date) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
              </div>
            </div>
            <div className="bg-white rounded-xl p-4">
              <div className="text-sm text-gray-500 mb-1">Trips Remaining</div>
              <div className="text-lg font-bold">
                {activeSubscription.ambulance_trips_included - activeSubscription.ambulance_trips_used}
              </div>
              <div className="text-sm text-gray-500">of {activeSubscription.ambulance_trips_included} included</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Coverage Limit</span>
              <span className="font-bold">KES {activeSubscription.coverage_limit_kes?.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-ems-accent h-2 rounded-full"
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Protection Plan</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Select a plan that fits your needs. All plans include 24/7 emergency dispatch and SHA integration.
        </p>
      </div>

      {/* Plan Type Selector */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all ${
              selectedPlan === plan.id
                ? 'border-ems-navy bg-ems-navy text-white'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <plan.icon className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">{plan.name}</div>
              <div className={`text-sm ${selectedPlan === plan.id ? 'text-white/80' : 'text-gray-500'}`}>
                {plan.description}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Tier Selection */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {['basic', 'standard', 'premium'].map((tier) => {
          const plan = plans.find(p => p.id === selectedPlan)
          const tierData = plan.tiers[tier]
          const isSelected = selectedTier === tier

          return (
            <div
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`card cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-ems-navy shadow-xl' : 'hover:shadow-lg'
              }`}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold capitalize mb-2">{tier}</h3>
                <div className="text-4xl font-bold text-ems-navy">
                  KES {tierData.price.toLocaleString()}
                </div>
                <div className="text-gray-500">per year</div>
              </div>

              <div className="space-y-3 mb-6">
                {features[tier].map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 flex-shrink-0 ${
                      idx < (tier === 'basic' ? 4 : tier === 'standard' ? 6 : 8) 
                        ? 'text-ems-accent' 
                        : 'text-gray-300'
                    }`} />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ambulance trips</span>
                  <span className="font-semibold">{tierData.trips}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Coverage limit</span>
                  <span className="font-semibold">KES {tierData.limit.toLocaleString()}</span>
                </div>
              </div>

              <button
                className={`w-full mt-6 py-3 rounded-xl font-semibold transition-colors ${
                  isSelected
                    ? 'bg-ems-navy text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isSelected ? 'Selected' : 'Select Plan'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Summary & Payment */}
      <div className="card max-w-2xl mx-auto">
        <h3 className="text-xl font-bold mb-4">Subscription Summary</h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Plan Type</span>
            <span className="font-medium capitalize">{selectedPlan}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Tier</span>
            <span className="font-medium capitalize">{selectedTier}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Coverage County</span>
            <span className="font-medium">{user?.county || 'Nairobi City'}</span>
          </div>
          <div className="flex justify-between py-2 text-lg font-bold">
            <span>Total</span>
            <span className="text-ems-navy">
              KES {plans.find(p => p.id === selectedPlan).tiers[selectedTier].price.toLocaleString()}
            </span>
          </div>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Pay with M-Pesa
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          You'll receive an M-Pesa STK push on your phone to complete payment
        </p>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Payment Initiated</h3>
              <p className="text-gray-600 mb-6">
                Please check your phone and enter your M-Pesa PIN to complete the payment of KES{' '}
                {plans.find(p => p.id === selectedPlan).tiers[selectedTier].price.toLocaleString()}
              </p>
              <button
                onClick={() => {
                  setShowPayment(false)
                  fetchActiveSubscription()
                }}
                className="btn-primary"
              >
                I've Completed Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}