import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EmployerDashboardComponent from '../components/Dashboard/EmployerDashboard';

export default function EmployerDashboard() {
  const { user } = useAuth();

  // Redirect if not employer
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'employer') {
    return <Navigate to="/" />;
  }

  return <EmployerDashboardComponent />;
}
