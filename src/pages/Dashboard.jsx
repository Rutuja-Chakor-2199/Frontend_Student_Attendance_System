import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Webcam from "react-webcam";
import { markAttendance, getStats, getLogs } from "../api";
import { CheckCircle, Users, Activity, ShieldCheck, Clock, Loader2, AlertCircle, Building, Calendar } from "lucide-react";

const Dashboard = () => {
  const webcamRef = useRef(null);
  const [stats, setStats] = useState({ total_students: 0, present_today: 0 });
  const [logs, setLogs] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [cooldown, setCooldown] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [processingCount, setProcessingCount] = useState(0);

  // College information
  const collegeInfo = {
    name: "Trinity Academy of Engineering (TAE)",
    shortName: "TAE",
    address: "Pune, India",
    established: "2000"
  };

  // Fetch data with error handling
  const fetchData = useCallback(async () => {
    try {
      const [sResponse, lResponse] = await Promise.all([
        getStats().catch(err => {
          console.error("Stats error:", err);
          return { data: { total_students: 0, present_today: 0 } };
        }),
        getLogs().catch(err => {
          console.error("Logs error:", err);
          return { data: [] };
        })
      ]);
      
      setStats(sResponse.data);
      setLogs(lResponse.data);
    } catch (e) { 
      console.error("API Error", e);
    }
  }, []);

  // Initial load and interval with cleanup
  useEffect(() => {
    queueMicrotask(() => {
      void fetchData();
    });
    
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Optimized scan logic with better error handling
  useEffect(() => {
    let scanInterval;
    
    if (isScanning && !cooldown && !cameraError) {
      scanInterval = setInterval(async () => {
        if (!webcamRef.current) return;

        try {
          const imageSrc = webcamRef.current.getScreenshot({
            quality: 0.8,
            width: 640,
            height: 480
          });

          if (!imageSrc) return;

          setProcessingCount(prev => prev + 1);
          
          const res = await markAttendance({ image: imageSrc });
          
          if (res.data?.match) {
            setSuccessMsg(res.data.name);
            setCooldown(true);
            fetchData(); // Refresh logs immediately

            // 3 Second pause with visual feedback
            setTimeout(() => {
              setSuccessMsg("");
              setCooldown(false);
            }, 3000);
          }
        } catch (error) {
          console.error("Scan error:", error);
          // Only show error if it's not a face detection error
          if (!error.response?.data?.error?.includes("No face")) {
            setCameraError(true);
            setTimeout(() => setCameraError(false), 2000);
          }
        }
      }, 2000);
    }
    
    return () => {
      if (scanInterval) clearInterval(scanInterval);
    };
  }, [isScanning, cooldown, cameraError, fetchData]);

  // Memoized logs for performance
  const memoizedLogs = useMemo(() => {
    return logs.slice(0, 10).map((log, i) => ({
      ...log,
      id: `${log.date}-${i}-${log.time}`,
      initials: log.name?.charAt(0)?.toUpperCase() || '?'
    }));
  }, [logs]);

  // Camera status
  const cameraStatus = useMemo(() => {
    if (cameraError) return { text: "Camera Error", color: "text-red-500" };
    if (isScanning && !cooldown) return { text: "SCANNING", color: "text-green-500" };
    if (cooldown) return { text: "PROCESSING", color: "text-blue-500" };
    return { text: "SYSTEM IDLE", color: "text-slate-400" };
  }, [isScanning, cooldown, cameraError]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans text-slate-800">
      {/* Enhanced Mobile-First Navbar */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-lg px-4 py-3 sm:px-6 sticky top-0 z-50 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <ShieldCheck className="text-blue-600" size={20} sm:size={24} />
            <div>
              <h1 className="text-lg sm:text-xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Smart<span className="text-blue-600">Attendance</span>
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 hidden sm:block">
                {collegeInfo.shortName} - {collegeInfo.address}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-xs font-mono px-2 sm:px-3 py-1 rounded-full bg-slate-100 text-slate-600">
              {cameraStatus.text}
            </div>
            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${cameraStatus.color} ${
              isScanning && !cooldown ? 'animate-pulse' : ''
            }`} />
          </div>
        </div>
      </nav>

      {/* College Header - Mobile First */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 sm:px-6 sm:py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <Building size={20} sm:size={24} />
              <div>
                <h2 className="text-lg sm:text-xl font-bold">{collegeInfo.name}</h2>
                <p className="text-xs sm:text-sm opacity-90">
                  Master of Computer Applications (MCA)
                </p>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-xs opacity-75">Established {collegeInfo.established}</p>
              <p className="text-sm font-semibold">{new Date().toLocaleDateString('en-IN', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Mobile-First Layout */}
        <div className="space-y-6 lg:space-y-8">
          
          {/* Camera Section - Full Width on Mobile */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-200 relative overflow-hidden">
            {/* Enhanced Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
              <h2 className="font-bold text-slate-700 flex items-center gap-3 text-base sm:text-lg">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                  isScanning && !cooldown ? 'bg-red-500 animate-pulse' : 'bg-slate-400'
                }`} />
                Live Face Detection
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                {processingCount > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">
                    {processingCount} scans
                  </span>
                )}
                <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
                  {cameraStatus.text}
                </span>
              </div>
            </div>

            {/* Enhanced Camera Box - Mobile Optimized with Mirror */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden relative shadow-2xl mb-4 sm:mb-6">
              <Webcam 
                ref={webcamRef} 
                screenshotFormat="image/jpeg" 
                className="w-full h-full object-cover scale-x-[-1] sm:scale-x-100"
                videoConstraints={{
                  width: window.innerWidth < 640 ? 320 : 640,
                  height: window.innerWidth < 640 ? 240 : 480,
                  facingMode: "user"
                }}
                mirrored={true}
              />

              {/* Enhanced Scanning Line */}
              {isScanning && !successMsg && !cameraError && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-scan opacity-90" />
              )}

              {/* Camera Error Overlay */}
              {cameraError && (
                <div className="absolute inset-0 bg-red-500/10 flex flex-col items-center justify-center">
                  <AlertCircle size={32} sm:size={48} className="text-red-500 mb-4" />
                  <h3 className="text-red-600 font-semibold text-sm sm:text-base">Camera Error</h3>
                  <p className="text-red-400 text-xs sm:text-sm mt-2">Please check camera permissions</p>
                </div>
              )}

              {/* Enhanced Success Overlay */}
              {successMsg && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-4">
                  <div className="relative">
                    <CheckCircle size={48} sm:size={80} className="text-green-500 mb-4 animate-bounce" />
                    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                  </div>
                  <h2 className="text-xl sm:text-3xl font-bold text-slate-800 mb-2">Verified!</h2>
                  <p className="text-slate-600 text-sm sm:text-lg mb-4">Attendance Marked</p>
                  <div className="bg-blue-100 text-blue-700 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-lg shadow-lg">
                    {successMsg}
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Control Button */}
            <button
              onClick={() => {
                if (!isScanning) {
                  setProcessingCount(0);
                  setCameraError(false);
                }
                setIsScanning(!isScanning);
              }}
              className={`w-full py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-lg transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 ${
                isScanning
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                  : 'bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-900'
              }`}
            >
              {isScanning ? (
                <>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse" />
                  STOP SCANNING
                </>
              ) : (
                <>
                  <ShieldCheck size={16} sm:size={20} />
                  START ATTENDANCE
                </>
              )}
            </button>
          </div>

          {/* Stats Cards - Responsive Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-50 p-2 sm:p-4 rounded-full group-hover:scale-110 transition-transform">
                  <Users className="text-blue-600" size={20} sm:size={28} />
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">{stats.total_students}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-50 p-2 sm:p-4 rounded-full group-hover:scale-110 transition-transform">
                  <CheckCircle className="text-green-600" size={20} sm:size={28} />
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Present</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.present_today}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Logs Section - Mobile Optimized */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="p-4 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
              <h3 className="font-bold text-base sm:text-lg text-slate-800 flex items-center gap-3">
                <Activity size={16} sm:size={20} className="text-blue-500" />
                Recent Activity
                {logs.length > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {logs.length} records
                  </span>
                )}
              </h3>
            </div>

            <div className="max-h-96 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {memoizedLogs.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-300">
                  <Clock size={40} sm:size={56} className="mb-4 opacity-50" />
                  <p className="text-base sm:text-lg font-medium">No attendance records yet</p>
                  <p className="text-sm mt-2">Start scanning to mark attendance</p>
                </div>
              ) : (
                memoizedLogs.map((log) => (
                  <div 
                    key={log.id}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 rounded-xl transition-all border border-transparent hover:border-slate-100 group"
                  >
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform text-xs sm:text-base">
                      {log.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                        {log.name}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                        <Calendar size={10} />
                        <span className="truncate">{log.date}</span>
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-1 sm:px-3 sm:py-2 rounded-lg">
                        {log.time}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan { 
          0% { top: 0% } 
          100% { top: 100% } 
        }
        .animate-scan { 
          animation: scan 2s infinite linear; 
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
