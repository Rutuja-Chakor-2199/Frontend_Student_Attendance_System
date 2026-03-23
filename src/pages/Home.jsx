import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  LogIn,
  UserPlus,
  Camera,
  GraduationCap,
  MapPin,
  Building2,
  Sparkles,
  Users,
  Clock,
  CheckCircle,
  Zap,
  Award,
  BarChart3
} from 'lucide-react';

const Home = () => {
  // College Information
  const collegeInfo = {
    name: "Trinity Academy of Engineering (TAE)",
    shortName: "TAE",
    parentInstitute: "KJ's Educational Institutes (KJEI)",
    location: "Sr. No. 25 & 27, Kondhwa-Saswad Road, Bopdev Ghat, Pune – 411048",
    department: "Master of Computer Applications (MCA)",
    developer: "Rutuja Chakor (MCA-2nd Year)"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-900">
      {/* Enhanced Header */}
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShieldCheck className="text-blue-600" size={28} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Smart<span className="text-blue-600">Attendance</span>
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">AI-Powered Face Recognition System</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/scanner"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 sm:px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-md"
            >
              <Camera size={16} />
              <span className="hidden sm:inline">Scanner</span>
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 sm:px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:shadow-md"
            >
              <LogIn size={16} />
              <span className="hidden sm:inline">Login</span>
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 sm:px-4 py-2 text-sm font-semibold text-white transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
            >
              <UserPlus size={16} />
              <span className="hidden sm:inline">Register</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <section className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-bold tracking-wider text-blue-800 mb-6">
            <Sparkles size={14} />
            AI-POWERED FACE RECOGNITION
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight text-slate-900 mb-6">
            {collegeInfo.name}
            <span className="block text-blue-600">Pune</span>
          </h2>
          
          <p className="text-lg sm:text-xl text-slate-600 max-w-4xl mx-auto mb-8">
            Advanced attendance system for <span className="font-semibold text-blue-600">{collegeInfo.department}</span>. 
            Experience seamless face recognition, real-time tracking, and comprehensive analytics.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200">
              <Users className="text-blue-600 mx-auto mb-2" size={24} />
              <div className="text-2xl font-bold text-slate-900">500+</div>
              <div className="text-xs text-slate-500">Students</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200">
              <CheckCircle className="text-green-600 mx-auto mb-2" size={24} />
              <div className="text-2xl font-bold text-slate-900">99.2%</div>
              <div className="text-xs text-slate-500">Accuracy</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200">
              <Zap className="text-yellow-600 mx-auto mb-2" size={24} />
              <div className="text-2xl font-bold text-slate-900">&lt;2s</div>
              <div className="text-xs text-slate-500">Recognition</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200">
              <Award className="text-purple-600 mx-auto mb-2" size={24} />
              <div className="text-2xl font-bold text-slate-900">24/7</div>
              <div className="text-xs text-slate-500">Available</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/scanner"
              className="rounded-xl bg-slate-900 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-xl flex items-center justify-center gap-3"
            >
              <Camera size={20} />
              Start Attendance Scanner
            </Link>
            <Link
              to="/login"
              className="rounded-xl border-2 border-slate-900 bg-white px-8 py-4 text-base font-semibold text-slate-900 transition-all hover:bg-slate-50 hover:shadow-xl flex items-center justify-center gap-3"
            >
              <LogIn size={20} />
              Login Portal
            </Link>
            <Link
              to="/register"
              className="rounded-xl border-2 border-blue-600 bg-white px-8 py-4 text-base font-semibold text-blue-600 transition-all hover:bg-blue-50 hover:shadow-xl flex items-center justify-center gap-3"
            >
              <UserPlus size={20} />
              Register Student
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Main Feature Card */}
            <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-full bg-blue-600 p-3">
                  <Camera className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Live Face Recognition</h3>
                  <p className="text-sm text-blue-600">Real-time attendance marking</p>
                </div>
              </div>
              
              <p className="text-lg text-slate-700 mb-6">
                Our cutting-edge AI system instantly recognizes student faces with 99.2% accuracy, 
                making attendance marking completely automated and error-free.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <Clock className="text-blue-600 mb-2" size={20} />
                  <h4 className="font-semibold text-slate-900">Real-time Processing</h4>
                  <p className="text-sm text-slate-600 mt-1">Instant face detection in under 2 seconds</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <BarChart3 className="text-green-600 mb-2" size={20} />
                  <h4 className="font-semibold text-slate-900">Advanced Analytics</h4>
                  <p className="text-sm text-slate-600 mt-1">Comprehensive attendance reports and insights</p>
                </div>
              </div>
            </div>

            {/* Institute Info */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
              <h4 className="text-lg font-bold text-slate-900 mb-4">Institute Information</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="text-blue-600 mt-1" size={20} />
                  <div>
                    <h5 className="font-semibold text-slate-900">Institute Name</h5>
                    <p className="text-slate-600">{collegeInfo.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-blue-600 mt-1" size={20} />
                  <div>
                    <h5 className="font-semibold text-slate-900">Campus Location</h5>
                    <p className="text-slate-600">{collegeInfo.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <GraduationCap className="text-blue-600 mt-1" size={20} />
                  <div>
                    <h5 className="font-semibold text-slate-900">Department</h5>
                    <p className="text-slate-600">{collegeInfo.department}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="text-blue-600 mt-1" size={20} />
                  <div>
                    <h5 className="font-semibold text-slate-900">Parent Institute</h5>
                    <p className="text-slate-600">{collegeInfo.parentInstitute}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Quick Access</h3>
              <p className="text-sm text-slate-500 mb-6">Fast access to all system features</p>
              
              <div className="space-y-3">
                <Link
                  to="/scanner"
                  className="block rounded-xl border border-slate-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50 group"
                >
                  <div className="flex items-center gap-3">
                    <Camera className="text-blue-600 group-hover:scale-110 transition-transform" size={20} />
                    <div>
                      <p className="font-semibold text-slate-900">Attendance Scanner</p>
                      <p className="text-sm text-slate-500">Mark attendance via camera</p>
                    </div>
                  </div>
                </Link>
                
                <Link
                  to="/register"
                  className="block rounded-xl border border-slate-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50 group"
                >
                  <div className="flex items-center gap-3">
                    <UserPlus className="text-blue-600 group-hover:scale-110 transition-transform" size={20} />
                    <div>
                      <p className="font-semibold text-slate-900">Face Registration</p>
                      <p className="text-sm text-slate-500">Add student biometric data</p>
                    </div>
                  </div>
                </Link>
                
                <Link
                  to="/login"
                  className="block rounded-xl border border-slate-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50 group"
                >
                  <div className="flex items-center gap-3">
                    <LogIn className="text-blue-600 group-hover:scale-110 transition-transform" size={20} />
                    <div>
                      <p className="font-semibold text-slate-900">Admin & Student Login</p>
                      <p className="text-sm text-slate-500">Access dashboards and reports</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border border-green-200">
              <h4 className="text-lg font-bold text-green-900 mb-4">System Status</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">Face Recognition</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-green-800">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">Database</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-green-800">Connected</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">API Server</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-green-800">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <div className="mb-4">
              <h5 className="text-lg font-bold text-blue-400 mb-2">{collegeInfo.name}</h5>
              <p className="text-slate-400 text-sm">{collegeInfo.parentInstitute}</p>
              <p className="text-slate-500 text-xs mt-1">{collegeInfo.location}</p>
            </div>
            <div className="border-t border-slate-800 pt-4">
              <p className="text-slate-400 text-sm">
                Developed by <span className="text-blue-400 font-semibold">{collegeInfo.developer}</span>
              </p>
              <p className="text-slate-500 text-xs mt-2">
                © 2024 {collegeInfo.shortName}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
