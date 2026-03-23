import React, { useState, useRef, useCallback, useMemo } from "react";
import Webcam from "react-webcam";
import { registerStudent } from "../api";
import { UserPlus, Camera, CheckCircle, XCircle, AlertCircle, Loader2, User, GraduationCap, Mail, Phone, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const webcamRef = useRef(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ 
        name: "", 
        email: "", 
        rollNo: "",
        className: "",
        teacherName: "",
        phone: "",
        dept: "MCA", 
        password: "", 
        confirmPassword: "" 
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cameraLoading, setCameraLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [errors, setErrors] = useState({});

    // Enhanced form validation
    const validateForm = useCallback(() => {
        const newErrors = {};
        
        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = "Full name is required";
        } else if (formData.name.length < 3) {
            newErrors.name = "Name must be at least 3 characters";
        }
        
        // Roll number validation
        if (!formData.rollNo.trim()) {
            newErrors.rollNo = "Roll number is required";
        } else if (!/^[A-Za-z0-9/-]+$/.test(formData.rollNo)) {
            newErrors.rollNo = "Invalid roll number format";
        }
        
        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }
        
        // Class validation
        if (!formData.className.trim()) {
            newErrors.className = "Class/Section is required";
        }
        
        // Teacher name validation
        if (!formData.teacherName.trim()) {
            newErrors.teacherName = "Teacher name is required";
        }
        
        // Phone validation (optional but if provided)
        if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
            newErrors.phone = "Please enter a valid 10-digit phone number";
        }
        
        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        
        if (!image) {
            newErrors.image = "Please capture a photo";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, image]);

    // Capture photo with better error handling
    const capture = useCallback(() => {
        if (!webcamRef.current) {
            setMessage({ type: "error", text: "Camera not ready. Please refresh and try again." });
            return;
        }
        
        setCameraLoading(true);
        try {
            const imageSrc = webcamRef.current.getScreenshot({
                quality: 0.8,
                width: 640,
                height: 480
            });
            
            if (imageSrc) {
                setImage(imageSrc);
                setMessage(null);
                setErrors(prev => ({ ...prev, image: null }));
            } else {
                setMessage({ type: "error", text: "Failed to capture photo. Please try again." });
            }
        } catch (error) {
            console.error("Camera capture error:", error);
            setMessage({ type: "error", text: "Camera error. Please check permissions and try again." });
        } finally {
            setCameraLoading(false);
        }
    }, []);

    // Retake photo
    const retake = useCallback(() => {
        setImage(null);
        setMessage(null);
        setErrors(prev => ({ ...prev, image: null }));
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await registerStudent({
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                rollNo: formData.rollNo.trim().toUpperCase(),
                className: formData.className.trim(),
                teacherName: formData.teacherName.trim(),
                phone: formData.phone.trim(),
                dept: formData.dept,
                password: formData.password,
                image,
            });
            
            setMessage({ 
                type: "success", 
                text: "Registration successful! Redirecting to login..." 
            });

            setTimeout(() => navigate("/login"), 2000);

        } catch (error) {
            console.error("Registration Error:", error);
            let apiMessage = "Registration failed. Please try again.";

            if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                apiMessage = "Server timed out. Please try again in a moment.";
            } else if (error?.response?.data?.error) {
                apiMessage = error.response.data.error;
            } else if (error?.response?.data?.message) {
                apiMessage = error.response.data.message;
            }

            setMessage({ type: "error", text: apiMessage });
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes
    const handleInputChange = useCallback((field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        setErrors(prev => ({ ...prev, [field]: null }));
    }, []);

    // Memoize form state to prevent unnecessary re-renders
    const isFormValid = useMemo(() => {
        return formData.name.trim() && 
               formData.email.trim() && 
               formData.rollNo.trim() &&
               formData.className.trim() &&
               formData.teacherName.trim() &&
               formData.password.length >= 6 && 
               formData.password === formData.confirmPassword && 
               image;
    }, [formData, image]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
            {/* Mobile-First Container */}
            <div className="min-h-screen py-4 px-4 sm:py-6 sm:px-6 lg:py-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center justify-center gap-3 mb-2">
                        <UserPlus className="text-blue-600" size={28} />
                        Student Registration
                    </h1>
                    <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto">
                        Complete your information and capture a clear face photo for attendance tracking
                    </p>
                </div>

                {/* Main Content - Mobile First */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-6xl mx-auto">
                    
                    {/* Camera Section - Top on Mobile */}
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 border-b border-slate-200">
                        <div className="w-full space-y-4">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-slate-700 mb-2">Photo Capture</h3>
                                <p className="text-sm text-slate-600">
                                    {image ? "Photo captured successfully!" : "Position your face clearly in the camera"}
                                </p>
                            </div>

                            {/* Camera/Image Display - Mobile Optimized */}
                            <div className="relative w-full max-w-sm sm:max-w-md mx-auto aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                                {image ? (
                                    <img 
                                        src={image} 
                                        alt="Captured" 
                                        className="w-full h-full object-cover scale-x-[-1] sm:scale-x-100"
                                    />
                                ) : (
                                    <div className="relative">
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
                                        {cameraLoading && (
                                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                                <Loader2 size={24} sm:size={32} className="text-white animate-spin" />
                                                <p className="text-white text-xs sm:text-sm mt-2">Initializing Camera...</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {/* Enhanced Camera status indicator - Mobile Friendly */}
                                <div className={`absolute top-2 sm:top-4 right-2 sm:right-4 px-2 py-1 rounded-full text-xs font-semibold transition-all ${
                                    image 
                                        ? 'bg-green-500 text-white shadow-lg' 
                                        : 'bg-red-500 text-white animate-pulse shadow-lg'
                                }`}>
                                    <div className="flex items-center gap-1">
                                        <div className={`w-2 h-2 rounded-full ${image ? 'bg-white' : 'bg-white animate-pulse'}`} />
                                        <span className="hidden sm:inline">{image ? '✓ Captured' : '● Live'}</span>
                                        <span className="sm:hidden">{image ? '✓' : '●'}</span>
                                    </div>
                                </div>

                                {/* Camera Controls - Mobile Optimized */}
                                <div className="space-y-3 px-2 sm:px-0">
                                    {!image ? (
                                        <button
                                            type="button"
                                            onClick={capture}
                                            disabled={cameraLoading}
                                            className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                                        >
                                            {cameraLoading ? (
                                                <>
                                                    <Loader2 size={16} sm:size={20} className="animate-spin" />
                                                    <span className="text-sm sm:text-base">Capturing...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Camera size={16} sm:size={20} />
                                                    <span className="text-sm sm:text-base">📸 Capture Photo</span>
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <div className="space-y-3">
                                            {/* Preview with retake option */}
                                            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                                                <p className="text-green-700 text-sm font-semibold text-center">✅ Photo Captured Successfully!</p>
                                            </div>
                                            
                                            <button
                                                type="button"
                                                onClick={retake}
                                                disabled={loading}
                                                className="w-full py-3 sm:py-4 bg-white border-2 border-red-300 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                                            >
                                                <Camera size={16} sm:size={20} />
                                                <span className="text-sm sm:text-base">🔄 Retake Photo</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Photo Guidelines */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                                <h4 className="font-semibold text-blue-800 mb-2 text-sm">Photo Guidelines:</h4>
                                <ul className="text-xs text-blue-700 space-y-1">
                                    <li>• Ensure good lighting on your face</li>
                                    <li>• Look directly at the camera</li>
                                    <li>• Keep a neutral expression</li>
                                    <li>• Remove glasses if possible</li>
                                    <li>• Plain background works best</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="p-4 sm:p-6 lg:p-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange('name')}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                                            errors.name ? 'border-red-300 bg-red-50' : 'border-slate-300 focus:border-blue-500'
                                        }`}
                                        placeholder="Enter your full name"
                                        disabled={loading}
                                    />
                                    {errors.name && (
                                        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Roll Number Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Roll Number *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.rollNo}
                                        onChange={handleInputChange('rollNo')}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                                            errors.rollNo ? 'border-red-300 bg-red-50' : 'border-slate-300 focus:border-blue-500'
                                        }`}
                                        placeholder="e.g., 2023MCA001"
                                        disabled={loading}
                                    />
                                    {errors.rollNo && (
                                        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.rollNo}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Email ID *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange('email')}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                                            errors.email ? 'border-red-300 bg-red-50' : 'border-slate-300 focus:border-blue-500'
                                        }`}
                                        placeholder="your.email@college.edu"
                                        disabled={loading}
                                    />
                                    {errors.email && (
                                        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleInputChange('phone')}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                                            errors.phone ? 'border-red-300 bg-red-50' : 'border-slate-300 focus:border-blue-500'
                                        }`}
                                        placeholder="10-digit mobile number"
                                        disabled={loading}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Class/Section Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Class/Section *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.className}
                                        onChange={handleInputChange('className')}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                                            errors.className ? 'border-red-300 bg-red-50' : 'border-slate-300 focus:border-blue-500'
                                        }`}
                                        placeholder="e.g., MCA-2A, BCA-3B"
                                        disabled={loading}
                                    />
                                    {errors.className && (
                                        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.className}
                                        </p>
                                    )}
                                </div>

                                {/* Teacher Name Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Teacher Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.teacherName}
                                        onChange={handleInputChange('teacherName')}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                                            errors.teacherName ? 'border-red-300 bg-red-50' : 'border-slate-300 focus:border-blue-500'
                                        }`}
                                        placeholder="Class teacher's name"
                                        disabled={loading}
                                    />
                                    {errors.teacherName && (
                                        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.teacherName}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Department Field */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Department
                                </label>
                                <input
                                    type="text"
                                    value="Master of Computer Applications (MCA)"
                                    disabled
                                    className="w-full p-3 border border-slate-300 rounded-lg outline-none bg-slate-100 text-slate-600 cursor-not-allowed"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Password Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={formData.password}
                                        onChange={handleInputChange('password')}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                                            errors.password ? 'border-red-300 bg-red-50' : 'border-slate-300 focus:border-blue-500'
                                        }`}
                                        placeholder="Minimum 6 characters"
                                        disabled={loading}
                                    />
                                    {errors.password && (
                                        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Confirm Password *
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange('confirmPassword')}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                                            errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-slate-300 focus:border-blue-500'
                                        }`}
                                        placeholder="Re-enter password"
                                        disabled={loading}
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle size={12} />
                                            {errors.confirmPassword}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Status Messages */}
                            {message && (
                                <div className={`p-4 rounded-lg flex items-center gap-3 animate-fade-in ${
                                    message.type === 'success' 
                                        ? 'bg-green-100 text-green-700 border border-green-200' 
                                        : 'bg-red-100 text-red-700 border border-red-200'
                                }`}>
                                    {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                                    <span className="font-medium">{message.text}</span>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate("/")}
                                    disabled={loading}
                                    className="flex-1 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !isFormValid}
                                    className={`flex-1 py-3 text-white font-semibold rounded-xl transition-all flex justify-center items-center gap-2 ${
                                        loading || !isFormValid
                                            ? 'bg-slate-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg'
                                    }`}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={16} sm:size={20} className="animate-spin" />
                                            <span className="text-sm sm:text-base">Registering...</span>
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus size={16} sm:size={20} />
                                            <span className="text-sm sm:text-base">Register Now</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Register;
