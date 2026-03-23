import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../api'; // Need raw API or helper
import { CheckCircle, XCircle } from 'lucide-react';

const LeaveRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const { data } = await API.get('/leave/all');
            setRequests(data);
        } catch (error) {
            console.error("Failed to fetch leaves", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (email, from_date, status) => {
        try {
            await API.post('/leave/action', { email, from_date, status });
            // Optimistic update or refresh
            fetchRequests();
        } catch {
            alert("Action Failed");
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="ml-64 flex-1 p-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Leave Requests</h1>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600">Student</th>
                                <th className="p-4 font-semibold text-slate-600">Type</th>
                                <th className="p-4 font-semibold text-slate-600">Duration</th>
                                <th className="p-4 font-semibold text-slate-600">Reason</th>
                                <th className="p-4 font-semibold text-slate-600">Status</th>
                                <th className="p-4 font-semibold text-slate-600">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-400">Loading...</td></tr>
                            ) : requests.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-400">No pending requests.</td></tr>
                            ) : (
                                requests.map((req, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition">
                                        <td className="p-4">
                                            <p className="font-bold text-slate-800">{req.name}</p>
                                            <p className="text-xs text-slate-500">{req.email}</p>
                                        </td>
                                        <td className="p-4 font-medium text-slate-700">{req.type}</td>
                                        <td className="p-4 text-sm text-slate-600">
                                            {req.from_date} <br /> to {req.to_date}
                                        </td>
                                        <td className="p-4 text-sm text-slate-500 max-w-xs">{req.reason}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold
                                                ${req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                    req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {req.status === 'Pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleAction(req.email, req.from_date, 'Approved')}
                                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(req.email, req.from_date, 'Rejected')}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                                        title="Reject"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeaveRequests;
