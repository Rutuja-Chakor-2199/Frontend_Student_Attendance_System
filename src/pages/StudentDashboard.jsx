import React, { useContext, useEffect, useMemo, useState } from 'react';
import { getStudentDashboard } from '../api';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/auth-context';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar, CheckCircle2, XCircle, Clock3, Flame, RefreshCw, Building } from 'lucide-react';

const COLORS = ['#16a34a', '#ef4444'];

// College Information
const collegeInfo = {
    name: "Trinity Academy of Engineering (TAE)",
    shortName: "TAE",
    location: "Pune, India",
    department: "Master of Computer Applications (MCA)"
};

const parseDateLabel = (dateStr) => {
    const parsed = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return dateStr;
    return parsed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchStudentDashboard = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getStudentDashboard();
            setData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to load student dashboard.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentDashboard();
    }, []);

    const attendancePercentage = Number(data?.attendance_percentage || 0);
    const summary = data?.summary || { present_days: 0, absent_days: 0, total_sessions: 0, current_streak: 0 };
    const recentSessions = data?.recent_sessions || [];
    const history = data?.history || [];

    const attendanceData = useMemo(() => {
        const present = Math.max(0, Math.min(100, attendancePercentage));
        return [
            { name: 'Present', value: present },
            { name: 'Absent', value: Number((100 - present).toFixed(2)) }
        ];
    }, [attendancePercentage]);

    const attendanceStatusClass = attendancePercentage >= 75
        ? 'bg-green-100 text-green-700'
        : 'bg-red-100 text-red-700';
    const attendanceStatusText = attendancePercentage >= 75
        ? 'Attendance is in safe range.'
        : 'Attendance below 75%. Improve next sessions.';

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-slate-500">Loading student dashboard...</div>;
    }

    if (error) {
        return (
            <div className="flex min-h-screen bg-slate-50">
                <Sidebar />
                <div className="ml-64 flex-1 p-8">
                    <div className="bg-white border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-600 font-semibold mb-3">{error}</p>
                        <button
                            onClick={fetchStudentDashboard}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
                        >
                            <RefreshCw size={16} />
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="ml-64 flex-1 p-8">
                <header className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Building className="text-blue-600" size={24} />
                        <h1 className="text-2xl font-bold text-slate-800">
                            Hello, {data?.student_details?.name || user?.name || 'Student'}
                        </h1>
                    </div>
                    <p className="text-slate-500">
                        {collegeInfo.name} - {collegeInfo.department}
                    </p>
                    <p className="text-slate-400 text-sm">
                        {data?.student_details?.dept || 'N/A'} | {data?.student_details?.email || user?.email || 'N/A'}
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <p className="text-sm text-slate-500">Attendance %</p>
                        <h3 className={`text-3xl font-bold mt-1 ${attendancePercentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                            {attendancePercentage}%
                        </h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <p className="text-sm text-slate-500">Present Days</p>
                        <h3 className="text-3xl font-bold mt-1 text-green-600">{summary.present_days}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <p className="text-sm text-slate-500">Absent Days</p>
                        <h3 className="text-3xl font-bold mt-1 text-red-600">{summary.absent_days}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <p className="text-sm text-slate-500">Current Streak</p>
                        <h3 className="text-3xl font-bold mt-1 text-orange-600">{summary.current_streak} days</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                        <h3 className="font-semibold text-slate-700 mb-4">Overall Attendance</h3>
                        <div className="w-52 h-52 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={attendanceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={62}
                                        outerRadius={84}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {attendanceData.map((entry, index) => (
                                            <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value}%`} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className={`text-3xl font-bold ${attendancePercentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                                    {attendancePercentage}%
                                </span>
                                <span className="text-xs text-slate-400">attendance</span>
                            </div>
                        </div>
                        <p className={`mt-4 text-sm font-medium px-3 py-1 rounded-full ${attendanceStatusClass}`}>
                            {attendanceStatusText}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                            Total sessions tracked: {summary.total_sessions}
                        </p>
                    </div>

                    <div className="xl:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="font-semibold text-slate-700 mb-4">Recent Sessions (Last 7)</h3>
                        {recentSessions.length > 0 ? (
                            <div className="space-y-3">
                                {recentSessions.map((session) => (
                                    <div key={session.date} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                                <Calendar size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{parseDateLabel(session.date)}</p>
                                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Clock3 size={12} /> {session.time}
                                                </p>
                                            </div>
                                        </div>
                                        {session.status === 'Present' ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                                                <CheckCircle2 size={14} />
                                                Present
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-100 px-3 py-1 rounded-full">
                                                <XCircle size={14} />
                                                Absent
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-slate-400">No sessions found yet.</div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="font-semibold text-slate-700 mb-4">Marked Attendance History</h3>
                        {history.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="text-left border-b border-slate-200">
                                            <th className="py-3 pr-4 text-slate-500 font-semibold">Date</th>
                                            <th className="py-3 pr-4 text-slate-500 font-semibold">Time</th>
                                            <th className="py-3 text-slate-500 font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((log, index) => (
                                            <tr key={`${log.date}-${index}`} className="border-b border-slate-100">
                                                <td className="py-3 pr-4 text-slate-700 font-medium">{parseDateLabel(log.date)}</td>
                                                <td className="py-3 pr-4 text-slate-600">{log.time}</td>
                                                <td className="py-3">
                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                                                        <CheckCircle2 size={14} />
                                                        {log.status || 'Present'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-10 text-slate-400">No attendance records found.</div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="font-semibold text-slate-700 mb-4">Quick Insight</h3>
                        <div className="space-y-3">
                            <div className="p-3 rounded-lg bg-slate-50">
                                <p className="text-xs text-slate-500">Current Streak</p>
                                <p className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                                    <Flame size={15} className="text-orange-500" />
                                    {summary.current_streak} consecutive present session(s)
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-slate-50">
                                <p className="text-xs text-slate-500">Total Missed</p>
                                <p className="text-sm font-semibold text-slate-800">{summary.absent_days} session(s)</p>
                            </div>
                            <div className="p-3 rounded-lg bg-slate-50">
                                <p className="text-xs text-slate-500">Target</p>
                                <p className="text-sm font-semibold text-slate-800">
                                    Keep attendance at or above 75%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
