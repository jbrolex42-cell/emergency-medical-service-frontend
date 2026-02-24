import { useState} from "react"
export default function AdminDashboard() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  if (!user || user.role !== "admin") {
    navigate("/admin-login")
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6">
        <h2 className="text-xl font-bold mb-10">Admin Panel</h2>
        <nav className="space-y-4">
          <p className="hover:text-gray-300 cursor-pointer">Dashboard</p>
          <p className="hover:text-gray-300 cursor-pointer">Users</p>
          <p className="hover:text-gray-300 cursor-pointer">Reports</p>
          <p className="hover:text-gray-300 cursor-pointer">Settings</p>
        </nav>

        <button
          onClick={() => {
            logout()
            navigate("/admin-login")
          }}
          className="mt-10 bg-red-600 px-4 py-2 rounded-lg w-full"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-6">
          Welcome, {user.name}
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">Total Users</h3>
            <p className="text-2xl font-bold">1,245</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">Active Providers</h3>
            <p className="text-2xl font-bold">342</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">System Alerts</h3>
            <p className="text-2xl font-bold text-red-500">7</p>
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">User Management</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">John Doe</td>
                <td>john@email.com</td>
                <td>User</td>
                <td className="text-green-600">Active</td>
              </tr>
              <tr>
                <td className="py-2">Jane Smith</td>
                <td>jane@email.com</td>
                <td>Provider</td>
                <td className="text-red-600">Suspended</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )

const AdminDashboard = () => {
  // 1. Hooks MUST be inside the function component
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@email.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@email.com", role: "User" }
    // Add more mock users as needed
  ]); // <-- Make sure you have this closing ]);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "User",
  });

  return (
    <div className="p-4">
      <h1>Admin Dashboard</h1>
      {/* Your table or list of users goes here */}
    </div>
  );
};
 
  if (!user || user.role !== "admin") {
    navigate("/admin-login")
    return null
  }

  const handleAddOrEdit = (e) => {
    e.preventDefault()

    if (editingUser) {
      // Edit user
      setUsers(
        users.map((u) =>
          u.id === editingUser.id ? { ...u, ...formData } : u
        )
      )
    } else {
      // Add user
      const newUser = {
        id: Date.now(),
        ...formData,
      }
      setUsers([...users, newUser])
    }

    setShowModal(false)
    setEditingUser(null)
    setFormData({ name: "", email: "", role: "User" })
  }

  const handleDelete = (id) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  const openEdit = (user) => {
    setEditingUser(user)
    setFormData(user)
    setShowModal(true)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6">
        <h2 className="text-xl font-bold mb-10">Admin Panel</h2>
        <button
          onClick={() => {
            logout()
            navigate("/admin-login")
          }}
          className="bg-red-600 px-4 py-2 rounded-lg w-full"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Welcome, {user.name}
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            + Add User
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="py-2">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td className="space-x-3">
                    <button
                      onClick={() => openEdit(u)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <form
            onSubmit={handleAddOrEdit}
            className="bg-white p-8 rounded-2xl w-96"
          >
            <h2 className="text-xl font-bold mb-4">
              {editingUser ? "Edit User" : "Add User"}
            </h2>

            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 mb-3 border rounded"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 mb-3 border rounded"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <select
              className="w-full p-2 mb-4 border rounded"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option>User</option>
              <option>Provider</option>
              <option>Admin</option>
            </select>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false)
                  setEditingUser(null)
                }}
                className="text-gray-600"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                {editingUser ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}