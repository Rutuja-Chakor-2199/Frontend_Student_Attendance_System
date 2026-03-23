import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';
import { LayoutDashboard, Users, UserCheck, Calendar, LogOut } from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    if (!user) return null;

    const isActive = (path) => location.pathname === path ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white";

    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold tracking-tight">Campus<span className="text-blue-500">360</span></h1>
                <p className="text-xs text-slate-500 mt-1">Enterprise Management</p>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {user.role === 'hod' && (
                    <>
                        <Link to="/hod" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/hod')}`}>
                            <LayoutDashboard size={20} />
                            <span className="font-medium">Dashboard</span>
                        </Link>
                        <Link to="/students" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/students')}`}>
                            <Users size={20} />
                            <span className="font-medium">Students</span>
                        </Link>
                        <Link to="/leave-requests" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/leave-requests')}`}>
                            <UserCheck size={20} />
                            <span className="font-medium">Leave Requests</span>
                        </Link>
                    </>
                )}

                {user.role === 'student' && (
                    <>
                        <Link to="/student" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/student')}`}>
                            <LayoutDashboard size={20} />
                            <span className="font-medium">My Dashboard</span>
                        </Link>
                        <Link to="/attendance" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/attendance')}`}>
                            <Calendar size={20} />
                            <span className="font-medium">Attendance</span>
                        </Link>
                        <Link to="/leave" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/leave')}`}>
                            <Calendar size={20} />
                            <span className="font-medium">Apply Leave</span>
                        </Link>
                    </>
                )}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                        {user.name && user.name[0]}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                    </div>
                    <button onClick={logout} className="text-slate-400 hover:text-red-400">
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
