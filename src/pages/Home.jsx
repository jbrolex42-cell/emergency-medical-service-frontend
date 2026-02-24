import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { 
  Ambulance, 
  MapPin, 
  Shield, 
  Clock, 
  Smartphone, 
  HeartPulse,
  Users,
  Activity,
  ChevronRight
} from 'lucide-react'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'

const features = [
  {
    icon: MapPin,
    title: 'GPS-Based Dispatch',
    desc: 'Closest appropriate ambulance dispatched using real-time GPS tracking and what3words addressing for rural areas.'
  },
  {
    icon: Clock,
    title: '< 30 Min Response',
    desc: 'Target response time under 30 minutes in rural areas and under 15 minutes in urban centers.'
  },
  {
    icon: Shield,
    title: 'SHA Integrated',
    desc: 'Direct integration with Social Health Authority for cashless emergency care and automatic claims.'
  },
  {
    icon: Smartphone,
    title: 'USSD & App Access',
    desc: 'Access via *123# USSD for feature phones or Android app for smartphones. Works offline too.'
  }
]

const stats = [
  { value: '47', label: 'Counties Covered' },
  { value: '15min', label: 'Avg Urban Response' },
  { value: '30min', label: 'Avg Rural Response' },
  { value: '4K', label: 'KES/Year from' }
]

export default function Home() {
  const { user } = useAuthStore()

  return (
    <><div className="space-y-20 pb-20">
      {/* all your sections */}
      <section className="relative bg-gradient-to-br from-ems-dark via-ems-navy to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')] opacity-5"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6 border border-white/20">
                <span className="w-2 h-2 bg-ems-accent rounded-full animate-pulse"></span>
                Now serving all 47 counties
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Emergency Medical Services{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-ems-accent to-cyan-400">
                  Reimagined
                </span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 max-w-lg">
                Uber-style dispatch connecting patients with the nearest qualified ambulance
                across Kenya. No cash required at scene with SHA integration.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/emergency"
                  className="inline-flex items-center gap-2 bg-ems-danger hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg emergency-pulse"
                >
                  <Ambulance className="w-6 h-6" />
                  Get Emergency Help
                </Link>

                {!user && (
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all border border-white/30"
                  >
                    Subscribe Now
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                )}
              </div>

              <div className="mt-8 flex items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-ems-accent" />
                  KMPDC Licensed
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-ems-accent" />
                  SHA Empaneled
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-ems-accent" />
                  ODPC Compliant
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Live EMS Grid</h3>
                    <p className="text-sm text-gray-400">Real-time availability</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-ems-accent/20 rounded-full text-ems-accent text-sm">
                    <span className="w-2 h-2 bg-ems-accent rounded-full animate-pulse"></span>
                    24 Active Units
                  </div>
                </div>

                {/* Mock Map Visualization */}
                <div className="bg-gray-800 rounded-2xl h-64 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-30">
                    <svg className="w-full h-full" viewBox="0 0 400 300">
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>

                  {/* Mock ambulance markers */}
                  <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-ems-accent rounded-full border-2 border-white shadow-lg animate-bounce"></div>
                  <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                  <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-ems-accent rounded-full border-2 border-white shadow-lg"></div>
                  <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>

                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-3 py-2 rounded-lg text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 bg-ems-accent rounded-full"></span>
                      Available
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      En Route
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      Busy
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-ems-accent">156</div>
                    <div className="text-xs text-gray-400">Ambulances</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">89</div>
                    <div className="text-xs text-gray-400">Motorcycles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">12</div>
                    <div className="text-xs text-gray-400">Air Units</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl lg:text-5xl font-bold text-ems-navy mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform aggregates fragmented ambulance providers into a unified,
            responsive network available 24/7 across Kenya.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="card hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-ems-navy/10 rounded-2xl flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-ems-navy" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Subscription CTA */}
      <section className="bg-gradient-to-r from-ems-soft to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Subscribe from KES 4,000/year
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join over 2 million Kenyans who trust Kenya EMS Network for emergency medical coverage.
                No cash required at the scene - we bill SHA directly or cover through your subscription.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  'Unlimited emergency dispatches within coverage zone',
                  'No payment required at scene of emergency',
                  'Coverage for entire family (up to 4 members)',
                  'Access to both ambulance and motorcycle responders',
                  'Direct SHA integration for cashless care'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-ems-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Activity className="w-4 h-4 text-ems-accent" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/subscription"
                className="btn-primary inline-flex items-center gap-2"
              >
                <HeartPulse className="w-5 h-5" />
                View Subscription Plans
              </Link>
            </div>

            <div className="relative">
              <div className="card bg-white relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Individual Plan</h3>
                    <p className="text-gray-500">Most popular</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-ems-navy">KES 4,000</div>
                    <div className="text-sm text-gray-500">per year</div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Ambulance trips</span>
                    <span className="font-semibold">4 per year</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Coverage limit</span>
                    <span className="font-semibold">KES 100,000</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Response time</span>
                    <span className="font-semibold">&lt; 30 minutes</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">SHA integration</span>
                    <span className="font-semibold text-ems-accent">Included</span>
                  </div>
                </div>

                <Link
                  to="/register"
                  className="w-full btn-primary text-center block"
                >
                  Get Started
                </Link>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-ems-accent/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-ems-navy/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* For Providers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-ems-navy rounded-3xl p-8 lg:p-16 text-white">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Are You an EMS Provider?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join our network to increase your fleet utilization from 15% to over 60%.
                We handle dispatch, billing, and SHA integration so you can focus on saving lives.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-ems-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">More Trips</h4>
                    <p className="text-sm text-gray-400">Access to nationwide emergency calls</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Activity className="w-6 h-6 text-ems-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Digital Dispatch</h4>
                    <p className="text-sm text-gray-400">GPS-optimized routing and tracking</p>
                  </div>
                </div>
              </div>

              <button className="btn-secondary bg-white text-ems-navy hover:bg-gray-100 border-0">
                Register as Provider
              </button>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1587351021759-3e566b9af923?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                alt="Ambulance"
                className="rounded-2xl shadow-2xl" />
              <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-6 rounded-2xl shadow-xl">
                <div className="text-3xl font-bold text-ems-accent">60%</div>
                <div className="text-sm text-gray-600">Avg fleet utilization<br />vs 15% industry average</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
  };