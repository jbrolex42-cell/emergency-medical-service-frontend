import React from "react"
import { Navigate } from "react-router-dom"
import { useAuthStore } from "../stores/authStore"

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuthStore()

  // Not logged in
  if (!user) {
    return <Navigate to="/login" />
  }

  // Logged in but wrong role
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />
  }

  return children
}