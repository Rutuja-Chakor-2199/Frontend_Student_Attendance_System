import React, { useEffect, useMemo, useState } from 'react';
import { getHODDashboard } from '../api';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {
    Download,
    TrendingUp,
    Users,
    AlertCircle,
    GraduationCap,
    RefreshCw,
    Building
} from 'lucide-react';
import Sidebar from '../components/Sidebar';

// College Information
const collegeInfo = {
    name: "Trinity Academy of Engineering (TAE)",
    shortName: "TAE",
    location: "Pune, India",
    department: "Master of Computer Applications (MCA)"
};

const formatDateLabel = (dateStr) => {
    const parsed = new Date(`${dateStr}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return dateStr;
    return parsed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

const toCsvCell = (value) => {
    const normalized = String(value ?? '');
    return `"${normalized.replaceAll('"', '""')}"`;
};

const HODDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDashboard = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getHODDashboard();
            setData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to load dashboard right now.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const trendData = useMemo(() => {
        return (data?.attendance_trend || []).map((item) => ({
            ...item,
            label: formatDateLabel(item.date)
        }));
    }, [data]);

    const exportReport = () => {
        if (!data) return;

        const stats = data.stats || {};
        const csvRows = [
            ['Metric', 'Value'],
            ['Total Students', stats.total_students ?? 0],
            ['Faculty Members', stats.active_faculty ?? 0],
            ['Today Attendance', stats.today_attendance ?? 0],
            ['Today Attendance Rate (%)', stats.today_attendance_rate ?? 0],
            ['Average Attendance Rate (%)', stats.average_attendance_rate ?? 0],
            ['Total Sessions', stats.total_sessions ?? 0],
            [],
            ['Top Defaulters'],
            ['Name', 'Email', 'Department', 'Attendance (%)', 'Present Days', 'Total Sessions'],
            ...(data.defaulters || []).map((item) => [
                item.name,
                item.email,
                item.dept,
                item.attendance_percentage,
                item.present_days,
                item.total_sessions
            ]),
            [],
            ['Department Overview'],
            ['Department', 'Total Students', 'Present Today', 'Attendance (%)'],
            ...(data.dept_overview || []).map((item) => [
                item.dept,
                item.total_students,
                item.present_today,
                item.attendance_rate
            ])
        ];

        const csv = csvRows.map((row) => row.map(toCsvCell).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `hod-dashboard-${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-slate-500">Loading analytics...</div>;
    }

    if (error) {
        return (
            <div className="flex min-h-screen bg-slate-50">
                <Sidebar />
                <div className="ml-64 flex-1 p-8">
                    <div className="bg-white border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-600 font-semibold mb-3">{error}</p>
                        <button
                            onClick={fetchDashboard}
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

    const stats = data?.stats || {};

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="ml-64 flex-1 p-8">
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Building className="text-blue-600" size={24} />
                            <h1 className="text-2xl font-bold text-slate-800">HOD Dashboard</h1>
                        </div>
                        <p className="text-slate-500">{collegeInfo.name} - {collegeInfo.department}</p>
                        <p className="text-slate-400 text-sm">Attendance intelligence and risk tracking</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={fetchDashboard}
                            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm"
                        >
                            <RefreshCw size={18} />
                            Refresh
                        </button>
                        <button
                            onClick={exportReport}
                            className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-lg text-white hover:bg-slate-800 shadow-sm"
                        >
                            <Download size={18} />
                            Export CSV
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm">Total Students</p>
                                <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.total_students ?? 0}</h3>
                            </div>
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <GraduationCap size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm">Faculty Members</p>
                                <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.active_faculty ?? 0}</h3>
                            </div>
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <Users size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm">Today Attendance</p>
                                <h3 className="text-3xl font-bold text-green-600 mt-1">{stats.today_attendance ?? 0}</h3>
                                <p className="text-xs mt-1 text-slate-500">{stats.today_attendance_rate ?? 0}% rate</p>
                            </div>
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                <TrendingUp size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm">Defaulters</p>
                                <h3 className="text-3xl font-bold text-red-600 mt-1">{data?.defaulter_count ?? 0}</h3>
                                <p className="text-xs mt-1 text-slate-500">Below 75% attendance</p>
                            </div>
                            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                <AlertCircle size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                    <div className="xl:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="font-semibold text-slate-800 mb-6">7-Day Trend</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <YAxis
                                        yAxisId="left"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        allowDecimals={false}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        axisLine={false}
                                        tickLine={false}
                                        domain={[0, 100]}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        tickFormatter={(value) => `${value}%`}
                                    />
                                    <Tooltip
                                        formatter={(value, name) =>
                                            name === 'rate' ? [`${value}%`, 'Attendance Rate'] : [value, 'Present Count']
                                        }
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 8px 20px rgba(15, 23, 42, 0.08)'
                                        }}
                                    />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="count"
                                        name="count"
                                        stroke="#1d4ed8"
                                        strokeWidth={3}
                                        dot={{ r: 3 }}
                                        activeDot={{ r: 5 }}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="rate"
                                        name="rate"
                                        stroke="#16a34a"
                                        strokeWidth={3}
                                        dot={{ r: 3 }}
                                        activeDot={{ r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h3 className="font-semibold text-slate-800 mb-4">Top Defaulters</h3>
                        {data?.defaulters?.length > 0 ? (
                            <ul className="space-y-3">
                                {data.defaulters.map((student) => (
                                    <li key={student.email} className="p-3 rounded-lg bg-red-50 border border-red-100">
                                        <p className="text-sm font-semibold text-slate-800">{student.name}</p>
                                        <p className="text-xs text-slate-500">{student.dept || 'Unassigned'} | {student.email}</p>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-xs font-medium text-slate-600">
                                                {student.present_days}/{student.total_sessions} sessions
                                            </span>
                                            <span className="text-sm font-bold text-red-600">
                                                {student.attendance_percentage}%
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-10 text-slate-400 text-sm">No defaulters right now.</div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="font-semibold text-slate-800 mb-4">Department Overview (Today)</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-left border-b border-slate-200">
                                    <th className="py-3 pr-4 text-slate-500 font-semibold">Department</th>
                                    <th className="py-3 pr-4 text-slate-500 font-semibold">Students</th>
                                    <th className="py-3 pr-4 text-slate-500 font-semibold">Present</th>
                                    <th className="py-3 text-slate-500 font-semibold">Attendance Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(data?.dept_overview || []).map((dept) => (
                                    <tr key={dept.dept} className="border-b border-slate-100">
                                        <td className="py-3 pr-4 font-medium text-slate-700">{dept.dept}</td>
                                        <td className="py-3 pr-4 text-slate-600">{dept.total_students}</td>
                                        <td className="py-3 pr-4 text-slate-600">{dept.present_today}</td>
                                        <td className="py-3 font-semibold text-slate-700">{dept.attendance_rate}%</td>
                                    </tr>
                                ))}
                                {(data?.dept_overview || []).length === 0 && (
                                    <tr>
                                        <td className="py-6 text-center text-slate-400" colSpan={4}>
                                            No department data available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HODDashboard;
