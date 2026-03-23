import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy loading component for better performance
const LazyLoader = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 size={32} className="animate-spin text-blue-600" />
      <p className="text-slate-600 font-medium">Loading...</p>
    </div>
  </div>
);

// Lazy load components
export const LazyRegister = lazy(() => import('../pages/Register'));
export const LazyLogin = lazy(() => import('../pages/Login'));
export const LazyDashboard = lazy(() => import('../pages/Dashboard'));
export const LazyStudentDashboard = lazy(() => import('../pages/StudentDashboard'));
export const LazyHODDashboard = lazy(() => import('../pages/HODDashboard'));
export const LazyLeave = lazy(() => import('../pages/Leave'));
export const LazyLeaveRequests = lazy(() => import('../pages/LeaveRequests'));
export const LazyStudents = lazy(() => import('../pages/Students'));

// Wrapper component for lazy loading with fallback
export const LazyWrapper = ({ children }) => (
  <Suspense fallback={<LazyLoader />}>
    {children}
  </Suspense>
);

export default LazyLoader;
