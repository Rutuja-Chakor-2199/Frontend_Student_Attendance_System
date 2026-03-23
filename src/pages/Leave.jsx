import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { applyLeave, getMyLeaves } from '../api';
import { Calendar, Send, Clock, CheckCircle, XCircle } from 'lucide-react';

const Leave = () => {
    const [leaves, setLeaves] = useState([]);
    const [formData, setFormData] = useState({
        type: 'Sick Leave',
        from_date: '',
        to_date: '',
        reason: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const fetchLeaves = async () => {
        try {
            const { data } = await getMyLeaves();
            setLeaves(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        queueMicrotask(() => {
            void fetchLeaves();
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await applyLeave(formData);
            setMessage("Leave applied successfully!");
            setFormData({ type: 'Sick Leave', from_date: '', to_date: '', reason: '' });
            fetchLeaves();
        } catch {
            setMessage("Failed to apply leave.");
        }
        setLoading(false);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="ml-64 flex-1 p-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Leave Management</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Apply Form */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit">
                        <h2 className="font-semibold text-lg text-slate-700 mb-4 flex items-center gap-2">
                            <Send size={20} className="text-blue-500" /> Apply for Leave
                        </h2>

                        {message && (
                            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Leave Type</label>
                                <select
                                    className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option>Sick Leave</option>
                                    <option>Casual Leave</option>
                                    <option>Emergency</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">From Date</label>
                                    <input
                                        type="date" required
                                        className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.from_date}
                                        onChange={(e) => setFormData({ ...formData, from_date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-1">To Date</label>
                                    <input
                                        type="date" required
                                        className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.to_date}
                                        onChange={(e) => setFormData({ ...formData, to_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Reason</label>
                                <textarea
                                    required rows="3"
                                    className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter reason..."
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                ></textarea>
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </form>
                    </div>

                    {/* Leave History */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="font-semibold text-lg text-slate-700 flex items-center gap-2">
                            <Clock size={20} className="text-slate-500" /> My Applications
                        </h2>

                        {leaves.length === 0 ? (
                            <div className="text-slate-400 text-center py-10">No leave history.</div>
                        ) : (
                            leaves.map((leave, index) => (
                                <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-bold text-slate-800">{leave.type}</span>
                                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{leave.from_date} to {leave.to_date}</span>
                                        </div>
                                        <p className="text-sm text-slate-500">{leave.reason}</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1
                                        ${leave.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                            leave.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {leave.status === 'Approved' && <CheckCircle size={16} />}
                                        {leave.status === 'Rejected' && <XCircle size={16} />}
                                        {leave.status === 'Pending' && <Clock size={16} />}
                                        {leave.status}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leave;
