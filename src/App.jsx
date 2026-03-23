import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthContext } from './context/auth-context';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard'; // Public/Admin Face Scan Page
import Register from './pages/Register';
import Login from './pages/Login';
import HODDashboard from './pages/HODDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Leave from './pages/Leave';
import LeaveRequests from './pages/LeaveRequests';
import Students from './pages/Students';

// Protected Route Component
const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    // Redirect based on their actual role
    if (user.role === 'hod') return <Navigate to="/hod" />;
    if (user.role === 'student') return <Navigate to="/student" />;
    return <Navigate to="/scanner" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* The Face Scan Dashboard (Admin/Machine View) */}
          <Route path="/scanner" element={<Dashboard />} />
          <Route
            path="/attendance"
            element={
              <PrivateRoute role="student">
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/hod"
            element={
              <PrivateRoute role="hod">
                <HODDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/student"
            element={
              <PrivateRoute role="student">
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/leave"
            element={
              <PrivateRoute role="student">
                <Leave />
              </PrivateRoute>
            }
          />
          <Route
            path="/leave-requests"
            element={
              <PrivateRoute role="hod">
                <LeaveRequests />
              </PrivateRoute>
            }
          />
          <Route
            path="/students"
            element={
              <PrivateRoute role="hod">
                <Students />
              </PrivateRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
