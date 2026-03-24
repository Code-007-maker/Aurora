'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, ShieldAlert, Check } from 'lucide-react';

export default function UserManagementModal({ onClose }: { onClose: () => void }) {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/clerk/users');
            const data = await res.json();
            setUsers(data || []);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        setUpdating(userId);
        try {
            await fetch('/api/clerk/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole })
            });
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (e) {
            console.error(e);
        }
        setUpdating(null);
    };

    const roles = ['Citizen', 'Ward Officer', 'City Admin', 'System Admin'];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-xl p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
                <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-slate-800/50">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <Users className="w-5 h-5 text-blue-400 mr-2" />
                            System Admin — Access Control
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">Manage platform roles across all registered personnel.</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="relative w-10 h-10 border-t-2 border-slate-500 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-xs text-slate-400 uppercase tracking-wider">
                                    <th className="pb-3 pl-2">User Email</th>
                                    <th className="pb-3">Current Role</th>
                                    <th className="pb-3 text-right pr-2">Assign New Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u, i) => (
                                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="py-4 pl-2 font-medium text-slate-200">{u.email}</td>
                                        <td className="py-4">
                                            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border rounded border-blue-500/30 text-blue-400 bg-blue-500/10">
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right pr-2">
                                            <div className="flex items-center justify-end space-x-2">
                                                {roles.map(r => (
                                                    <button
                                                        key={r}
                                                        onClick={() => handleRoleChange(u.id, r)}
                                                        disabled={updating === u.id || u.role === r}
                                                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border transition-colors ${
                                                            u.role === r 
                                                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 cursor-default' 
                                                                : 'bg-transparent text-slate-500 border-white/10 hover:text-white hover:border-slate-500'
                                                        }`}
                                                    >
                                                        {updating === u.id && u.role !== r ? '...' : r}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="py-8 text-center text-slate-500 text-sm">No users found in Clerk.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
