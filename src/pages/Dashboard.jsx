import { useEffect, useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { 
  Ambulance, 
  HeartPulse, 
  MapPin, 
  Phone, 
  Clock,
  AlertTriangle,
  CheckCircle,
  User
} from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    activeSubscription: null,
    recentEmergencies: [],
    isLoading: true
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [subRes, emergencyRes] = await Promise.all([
        api.get('/subscriptions/active').catch(() => ({ data: null })),
        api.get('/emergencies/my').catch(() => ({ data: { emergencies: [] } }))
      ])

      setStats({
        activeSubscription: subRes?.data?.subscription || null,
        recentEmergencies: emergencyRes?.data?.emergencies?.slice(0, 5) || [],
        isLoading: false
      })
    } catch (error) {
      setStats(prev => ({ ...prev, isLoading: false }))
    }
  }

  if (stats.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ems-navy"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-gray-600 mt-1">Here's your emergency medical overview</p>
        </div>
        <Link
          to="/emergency"
          className="btn-danger flex items-center gap-2"
        >
          <Ambulance className="w-5 h-5" />
          New Emergency
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-ems-navy to-blue-800 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Subscription Status</p>
              <p className="text-2xl font-bold mt-1">
                {stats.activeSubscription ? 'Active' : 'No Plan'}
              </p>
            </div>
            <HeartPulse className="w-10 h-10 text-white/30" />
          </div>
          {stats.activeSubscription && (
            <p className="text-sm text-white/70 mt-4">
              Expires {new Date(stats.activeSubscription.end_date).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Emergency Trips</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.activeSubscription?.ambulance_trips_used || 0} / {stats.activeSubscription?.ambulance_trips_included || 0}
              </p>
            </div>
            <Ambulance className="w-10 h-10 text-ems-navy/20" />
          </div>
          <p className="text-sm text-gray-500 mt-4">Remaining this year</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Coverage Limit</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                KES {(stats.activeSubscription?.coverage_limit_kes / 1000) || 0}K
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500/20" />
          </div>
          <p className="text-sm text-gray-500 mt-4">Annual coverage</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Coverage County</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.activeSubscription?.coverage_county || user?.county || 'N/A'}
              </p>
            </div>
            <MapPin className="w-10 h-10 text-ems-navy/20" />
          </div>
          <p className="text-sm text-gray-500 mt-4">Primary coverage area</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Subscription Status */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Subscription</h2>
              <Link to="/subscription" className="text-ems-navy hover:underline text-sm font-medium">
                Manage Plan
              </Link>
            </div>

            {stats.activeSubscription ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {stats.activeSubscription.plan_type.charAt(0).toUpperCase() + stats.activeSubscription.plan_type.slice(1)} Plan - {stats.activeSubscription.tier.charAt(0).toUpperCase() + stats.activeSubscription.tier.slice(1)}
                    </p>
                    <p className="text-sm text-gray-600">Active and ready for emergencies</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Start Date</p>
                    <p className="font-semibold">
                      {new Date(stats.activeSubscription.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">End Date</p>
                    <p className="font-semibold">
                      {new Date(stats.activeSubscription.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Auto Renew</p>
                    <p className="font-semibold">{stats.activeSubscription.auto_renew ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
                <p className="text-gray-600 mb-6">You don't have an active emergency medical subscription.</p>
                <Link to="/subscription" className="btn-primary">
                  Subscribe Now
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Emergency Contacts</h2>
          <div className="space-y-4">
            <a href="tel:719" className="flex items-center gap-4 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
              <div className="w-12 h-12 bg-ems-danger rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Emergency Hotline</p>
                <p className="text-2xl font-bold text-ems-danger">719</p>
              </div>
            </a>

            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">USSD Code</p>
              <p className="text-2xl font-bold text-ems-navy">*123#</p>
              <p className="text-xs text-gray-500 mt-1">Works on any phone</p>
            </div>

            {user?.emergency_contact_name && (
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">Your Emergency Contact</p>
                <p className="font-semibold text-gray-900">{user.emergency_contact_name}</p>
                <p className="text-ems-navy">{user.emergency_contact_phone}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Emergency Requests</h2>
        {stats.recentEmergencies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Response Time</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentEmergencies.map((emergency) => (
                  <tr key={emergency.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {new Date(emergency.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 capitalize">{emergency.emergency_type}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        emergency.status === 'completed' ? 'bg-green-100 text-green-700' :
                        emergency.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {emergency.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {emergency.arrival_time ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <Clock className="w-4 h-4" />
                          {Math.round((new Date(emergency.arrival_time) - new Date(emergency.created_at)) / 60000)} mins
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Ambulance className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No emergency requests yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180

  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) *
    Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}
const smartDispatch = (emergency) => {
  const availableVehicles = vehicles.filter(v => v.status === "Available")

  let closest = null
  let minDistance = Infinity

  availableVehicles.forEach(vehicle => {
    const distance = calculateDistance(
      emergency.lat,
      emergency.lng,
      vehicle.lat,
      vehicle.lng
    )

    if (distance < minDistance) {
      minDistance = distance
      closest = vehicle
    }
  })

  if (closest) {
    socketRef.current.emit("dispatchVehicle", {
      vehicleId: closest.id,
      emergencyId: emergency.id
    })
  }
}