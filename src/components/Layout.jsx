import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { 
  Ambulance, 
  Phone, 
  User, 
  LogOut, 
  Menu, 
  X,
  HeartPulse,
  MapPin,
  ShieldCheck // Added for Admin icon
} from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Layout() {
  const { user, logout } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  const navLinks = [
    { to: '/', label: 'Home', icon: MapPin },
    { to: '/emergency', label: 'Emergency', icon: Phone, emergency: true },
    ...(user ? [
      { to: '/dashboard', label: 'Dashboard', icon: User },
      { to: '/subscription', label: 'Subscription', icon: HeartPulse },
    ] : []),
    ...(user?.role === 'admin' ? [
      { to: '/admin', label: 'Admin Panel', icon: ShieldCheck }
    ] : []),
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-ems-navy/95 backdrop-blur-lg shadow-lg' : 'bg-gradient-to-r from-ems-dark to-ems-navy'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-white">
              <div className="w-10 h-10 bg-gradient-to-br from-ems-accent to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <Ambulance className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-lg leading-tight">Kenya EMS</div>
                <div className="text-xs text-white/70">Network</div>
              </div>
            </Link>

            {/* Desktop Navigation - FIXED: added 'div' tag */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    link.emergency
                      ? 'bg-ems-danger hover:bg-red-700 text-white animate-pulse-slow'
                      : isActive(link.to)
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-white/90 hover:text-white px-3 py-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{user.name?.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="px-4 py-2 text-white/90 hover:text-white text-sm font-medium">
                    Sign in
                  </Link>
                  <Link to="/register" className="px-4 py-2 bg-white text-ems-navy rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors">
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-ems-navy border-t border-white/10">
            <div className="px-4 py-3 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                    link.emergency
                      ? 'bg-ems-danger text-white'
                      : isActive(link.to)
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}

              {!user ? (
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-white/90 hover:bg-white/10 rounded-xl">
                    Sign in
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 bg-white text-ems-navy rounded-xl font-semibold text-center">
                    Register
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/10 rounded-xl"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 text-white mb-4">
                <Ambulance className="w-6 h-6 text-ems-accent" />
                <span className="font-bold">Kenya EMS Network</span>
              </div>
              <p className="text-sm">
                Revolutionizing emergency medical services in Kenya through technology, 
                ensuring every Kenyan has access to timely emergency care.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/emergency" className="hover:text-ems-accent">Request Emergency</Link></li>
                <li><Link to="/subscription" className="hover:text-ems-accent">Subscription Plans</Link></li>
                <li><Link to="/providers" className="hover:text-ems-accent">For Providers</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>USSD: *123#</li>
                <li>Emergency: 719</li>
                <li>jrolex42@gmail.com</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="hover:text-ems-accent">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-ems-accent">Terms of Service</Link></li>
                <li><Link to="#" className="hover:text-ems-accent">ODPC Compliance</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>© 2026 EMS Network. All rights reserved. ROLEX.O.O</p>
            <div className="flex justify-center gap-4 mt-2">
              <a href="https://www.instagram.com/irolex0?igsh=MTZ6NmlwamNidmE0NQ==" className="hover:text-white">Instagram</a>
              <a href="https://www.instagram.com/irolex0/links/" className="hover:text-white">Links</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}