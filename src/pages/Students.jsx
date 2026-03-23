import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getStudentsList } from '../api';
import { Search, RefreshCw, Users } from 'lucide-react';

const Students = () => {
    const [data, setData] = useState({ students: [], total_students: 0, total_sessions: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');

    const fetchStudents = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getStudentsList();
            setData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to load students.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const filteredStudents = useMemo(() => {
        const keyword = query.trim().toLowerCase();
        if (!keyword) return data.students || [];
        return (data.students || []).filter((student) =>
            [student.name, student.email, student.dept].some((value) =>
                String(value || '').toLowerCase().includes(keyword)
            )
        );
    }, [data.students, query]);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="ml-64 flex-1 p-8">
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Students</h1>
                        <p className="text-slate-500">Track registered students and attendance health</p>
                    </div>
                    <button
                        onClick={fetchStudents}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Total Registered</p>
                        <p className="text-3xl font-bold text-slate-800 mt-1">{data.total_students || 0}</p>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
                        <p className="text-sm text-slate-500">Sessions Recorded</p>
                        <p className="text-3xl font-bold text-blue-700 mt-1">{data.total_sessions || 0}</p>
                    </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-xl p-4 mb-4 shadow-sm">
                    <label className="relative block">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by name, email, or department"
                            className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </label>
                </div>

                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
                    {loading ? (
                        <div className="p-10 text-center text-slate-400">Loading students...</div>
                    ) : error ? (
                        <div className="p-10 text-center text-red-500">{error}</div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="p-10 text-center text-slate-400 flex flex-col items-center gap-2">
                            <Users size={22} />
                            No students found.
                        </div>
                    ) : (
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-left border-b border-slate-200 bg-slate-50">
                                    <th className="py-3 px-4 text-slate-600 font-semibold">Name</th>
                                    <th className="py-3 px-4 text-slate-600 font-semibold">Email</th>
                                    <th className="py-3 px-4 text-slate-600 font-semibold">Department</th>
                                    <th className="py-3 px-4 text-slate-600 font-semibold">Attendance</th>
                                    <th className="py-3 px-4 text-slate-600 font-semibold">Present/Total</th>
                                    <th className="py-3 px-4 text-slate-600 font-semibold">Last Seen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => {
                                    const isSafe = student.attendance_percentage >= 75;
                                    return (
                                        <tr key={student.student_id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-3 px-4 font-medium text-slate-800">{student.name}</td>
                                            <td className="py-3 px-4 text-slate-600">{student.email}</td>
                                            <td className="py-3 px-4 text-slate-600">{student.dept || 'Unassigned'}</td>
                                            <td className="py-3 px-4">
                                                <span
                                                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                        isSafe ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}
                                                >
                                                    {student.attendance_percentage}%
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-slate-600">
                                                {student.present_days}/{student.total_sessions}
                                            </td>
                                            <td className="py-3 px-4 text-slate-600">
                                                {student.last_seen_date
                                                    ? `${student.last_seen_date} ${student.last_seen_time || ''}`
                                                    : 'Never'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Students;
