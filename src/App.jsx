import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Subscription from './pages/Subscription';
import Emergency from './pages/Emergency';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import api from './services/api';


import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

const RoleRoute = ({ children, allowedRole }) => {
  const { user } = useAuthStore();
  
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== allowedRole) return <Navigate to="/dashboard" replace />;
  
  return children;
};

function App() {
  const { user } = useAuthStore();

  return (
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* AUTH ROUTES (Redirect to dashboard if already logged in) */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

        {/* GENERAL PROTECTED ROUTES (Any logged-in user) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/emergency" element={<Emergency />} />
        </Route>

        {/* PROVIDER ONLY ROUTES */}
        <Route 
          path="/provider" 
          element={
            <RoleRoute allowedRole="provider">
              <ProviderDashboard />
            </RoleRoute>
          } 
        />

        {/* ADMIN ONLY ROUTES */}
        <Route 
          path="/admin" 
          element={
            <RoleRoute allowedRole="admin">
              <AdminDashboard />
            </RoleRoute>
          } 
        />

        {/* 404 / CATCH ALL */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
}

export default App;