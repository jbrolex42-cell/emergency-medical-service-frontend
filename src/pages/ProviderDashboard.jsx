import { useState, useEffect } from "react"
import { useAuthStore } from "../stores/authStore"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { io } from "socket.io-client"

export default function ProviderDashboard() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState("overview")
  const [refreshTime, setRefreshTime] = useState(Date.now())

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTime(Date.now())
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const vehicles = [
    {
      id: 1,
      reg: "KDA 123A",
      type: "Ambulance",
      status: "Available",
      driver: "John Doe",
      emt: "Jane Smith",
      fuel: 80,
      oxygen: 70,
      lat: -1.2921,
      lng: 36.8219
    },
    {
      id: 2,
      reg: "KDB 456B",
      type: "Ambulance",
      status: "Dispatched",
      driver: "Mike Ross",
      emt: "Sarah Lee",
      fuel: 60,
      oxygen: 90,
      lat: -1.3000,
      lng: 36.8000
    }
  ]

  const emergencies = [
    { id: 1, location: "Nairobi CBD", severity: "Critical", status: "Pending" },
    { id: 2, location: "Westlands", severity: "Urgent", status: "Dispatched" }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "Available": return "bg-green-500"
      case "Dispatched": return "bg-red-500"
      case "En Route": return "bg-yellow-500"
      default: return "bg-gray-400"
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {user?.name} 👨‍⚕️
      </h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        {["overview", "fleet", "emergencies", "staff", "compliance"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 capitalize ${
              activeTab === tab
                ? "border-b-2 border-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">

          {/* Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card p-4 shadow">
              <h3 className="text-gray-500">Customer Rating</h3>
              <p className="text-2xl font-bold">4.8 ⭐</p>
            </div>
            <div className="card p-4 shadow">
              <h3 className="text-gray-500">Avg Response Time</h3>
              <p className="text-2xl font-bold">8 mins</p>
            </div>
            <div className="card p-4 shadow">
              <h3 className="text-gray-500">SHA Claims Success</h3>
              <p className="text-2xl font-bold">92%</p>
            </div>
            <div className="card p-4 shadow">
              <h3 className="text-gray-500">Revenue (Monthly)</h3>
              <p className="text-2xl font-bold">KES 2.4M</p>
            </div>
          </div>

          {/* Live Fleet Map */}
          <div className="card p-4 shadow">
            <h2 className="text-xl font-semibold mb-4">
              Live Fleet Tracking (Auto refresh 30s)
            </h2>

            <MapContainer
              center={[-1.2921, 36.8219]}
              zoom={12}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {vehicles.map(vehicle => (
                <Marker key={vehicle.id} position={[vehicle.lat, vehicle.lng]}>
                  <Popup>
                    <strong>{vehicle.reg}</strong><br />
                    Driver: {vehicle.driver}<br />
                    EMT: {vehicle.emt}<br />
                    Status: {vehicle.status}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      )}

      {/* FLEET TAB */}
      {activeTab === "fleet" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehicles.map(vehicle => (
            <div key={vehicle.id} className="card p-4 shadow space-y-2">
              <div className="flex justify-between">
                <h3 className="font-semibold">{vehicle.reg}</h3>
                <span className={`text-white px-2 py-1 rounded text-sm ${getStatusColor(vehicle.status)}`}>
                  {vehicle.status}
                </span>
              </div>

              <p>Type: {vehicle.type}</p>
              <p>Driver: {vehicle.driver}</p>
              <p>EMT: {vehicle.emt}</p>

              <div>
                <p>Fuel: {vehicle.fuel}%</p>
                <div className="bg-gray-200 h-2 rounded">
                  <div className="bg-green-500 h-2 rounded" style={{ width: `${vehicle.fuel}%` }}></div>
                </div>
              </div>

              <div>
                <p>Oxygen: {vehicle.oxygen}%</p>
                <div className="bg-gray-200 h-2 rounded">
                  <div className="bg-blue-500 h-2 rounded" style={{ width: `${vehicle.oxygen}%` }}></div>
                </div>
              </div>

              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Update Status
              </button>
            </div>
          ))}
        </div>
      )}

      {/* EMERGENCIES TAB */}
      {activeTab === "emergencies" && (
        <div className="card p-4 shadow">
          <h2 className="text-xl font-semibold mb-4">Active Emergencies</h2>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th>Location</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Dispatch</th>
              </tr>
            </thead>
            <tbody>
              {emergencies.map(em => (
                <tr key={em.id} className="border-b">
                  <td>{em.location}</td>
                  <td className={
                    em.severity === "Critical"
                      ? "text-red-600 font-semibold"
                      : em.severity === "Urgent"
                      ? "text-yellow-600"
                      : ""
                  }>
                    {em.severity}
                  </td>
                  <td>{em.status}</td>
                  <td>
                    <button className="bg-green-600 text-white px-3 py-1 rounded">
                      Dispatch
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* STAFF TAB */}
      {activeTab === "staff" && (
        <div className="card p-4 shadow">
          <h2 className="text-xl font-semibold mb-4">Staff Management</h2>
          <p>Driver & EMT profiles, license tracking (KMPDC, DL), performance ratings, trip counts, on-duty status.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
            Manage Staff
          </button>
        </div>
      )}

      {/* COMPLIANCE TAB */}
      {activeTab === "compliance" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-4 shadow">
            <h3 className="font-semibold">KMPDC License</h3>
            <p>Status: Active</p>
            <p>Expiry: Dec 2026</p>
          </div>

          <div className="card p-4 shadow">
            <h3 className="font-semibold">SHA Empanelment</h3>
            <p>Coverage: National</p>
            <p>Claims Settled: 154</p>
          </div>

          <div className="card p-4 shadow">
            <h3 className="font-semibold">Insurance</h3>
            <p>Provider: Jubilee</p>
            <p>Expiry: Aug 2026</p>
          </div>

          <div className="card p-4 shadow">
            <h3 className="font-semibold">ODPC Compliance</h3>
            <p>Certificate: Verified</p>
            <p>Last Audit: Jan 2026</p>
          </div>
        </div>
      )}

      {/* QUICK ACTIONS */}
      <div className="mt-10 flex flex-wrap gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Vehicle</button>
        <button className="bg-purple-600 text-white px-4 py-2 rounded">Schedule Maintenance</button>
        <button className="bg-green-600 text-white px-4 py-2 rounded">Direct Dispatch</button>
      </div>

    </div>
  )
}

