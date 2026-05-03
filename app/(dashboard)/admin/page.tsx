"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import Loader from "@/components/common/Loader";
import { 
    Users, 
    UserCheck, 
    UserX, 
    UserPlus,
    MoreVertical,
    ArrowUpRight,
    Search,
    Filter
} from "lucide-react";

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
}

interface UsersResponse {
    success: boolean;
    data: {
        users: User[];
        stats: {
            total: number;
            pending: number;
            approved: number;
            rejected: number;
            admins: number;
            members: number;
        };
    };
    message: string;
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get<UsersResponse>("/admin/users");
            setUsers(response.data.data.users);
            setStats(response.data.data.stats);
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId: string) => {
        setActionLoading(userId);
        try {
            await axiosInstance.patch(`/admin/users/${userId}/approve`);
            toast.success("User approved successfully");
            fetchUsers();
        } catch (error: any) {
            toast.error(error.message || "Failed to approve user");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (userId: string) => {
        setActionLoading(userId);
        try {
            await axiosInstance.patch(`/admin/users/${userId}/reject`);
            toast.success("User rejected successfully");
            fetchUsers();
        } catch (error: any) {
            toast.error(error.message || "Failed to reject user");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader size="lg" />
                <p className="text-text-secondary font-medium animate-pulse">Loading system data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">System Overview</h1>
                    <p className="text-text-secondary mt-1">Real-time statistics and user management.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border-theme text-text-primary rounded-xl hover:bg-secondary transition-colors text-sm font-medium shadow-sm active:scale-95">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:opacity-90 transition-all text-sm font-medium shadow-lg shadow-primary/20 active:scale-95">
                        Export Data
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Total Users" 
                        value={stats.total} 
                        icon={Users} 
                        color="indigo" 
                        trend="+12% from last month"
                    />
                    <StatCard 
                        title="Pending Requests" 
                        value={stats.pending} 
                        icon={UserPlus} 
                        color="amber" 
                        trend="Critical action needed"
                    />
                    <StatCard 
                        title="Approved Members" 
                        value={stats.approved} 
                        icon={UserCheck} 
                        color="emerald" 
                        trend="Growing community"
                    />
                    <StatCard 
                        title="Rejected" 
                        value={stats.rejected} 
                        icon={UserX} 
                        color="rose" 
                        trend="Security filters active"
                    />
                </div>
            )}

            {/* Users Section */}
            <div className="bg-surface/50 backdrop-blur-xl border border-border-theme rounded-3xl overflow-hidden shadow-2xl shadow-black/5 dark:shadow-black/50">
                <div className="p-6 border-b border-border-theme flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold text-text-primary">User Directory</h2>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..."
                            className="bg-background border border-border-theme rounded-xl pl-10 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:border-primary transition-all w-full sm:w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-background/50 text-text-secondary text-xs font-semibold uppercase tracking-wider">
                                <th className="px-8 py-4">User Details</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Joined Date</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-theme">
                            {users.map((u) => (
                                <tr key={u._id} className="group hover:bg-secondary/30 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-surface border border-border-theme flex items-center justify-center text-text-primary font-bold">
                                                {u.firstName[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-text-primary">{u.firstName} {u.lastName}</p>
                                                <p className="text-xs text-text-secondary">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            u.role === "admin" 
                                                ? "bg-primary/10 text-primary border border-primary/20" 
                                                : "bg-accent/10 text-accent border border-accent/20"
                                        }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            u.status === "approved"
                                                ? "bg-success/10 text-success border border-success/20"
                                                : u.status === "pending"
                                                ? "bg-warning/10 text-warning border border-warning/20"
                                                : "bg-error/10 text-error border border-error/20"
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                u.status === "approved" ? "bg-success" : u.status === "pending" ? "bg-warning" : "bg-error"
                                            }`} />
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm text-text-secondary">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        {u.status === "pending" ? (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleApprove(u._id)}
                                                    disabled={actionLoading === u._id}
                                                    className="px-3 py-1.5 bg-success hover:opacity-90 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-success/10 disabled:opacity-50"
                                                >
                                                    {actionLoading === u._id ? "..." : "Approve"}
                                                </button>
                                                <button
                                                    onClick={() => handleReject(u._id)}
                                                    disabled={actionLoading === u._id}
                                                    className="px-3 py-1.5 bg-error hover:opacity-90 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-error/10 disabled:opacity-50"
                                                >
                                                    {actionLoading === u._id ? "..." : "Reject"}
                                                </button>
                                            </div>
                                        ) : (
                                            <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary rounded-lg transition-colors">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-border-theme flex items-center justify-between">
                    <p className="text-sm text-text-secondary">Showing {users.length} of {stats?.total || 0} users</p>
                    <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-surface border border-border-theme text-text-secondary rounded-xl text-sm disabled:opacity-50" disabled>Previous</button>
                        <button className="px-4 py-2 bg-surface border border-border-theme text-text-primary rounded-xl text-sm hover:bg-secondary transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, trend }: any) {
    const colors: any = {
        indigo: "text-primary bg-primary/10 border-primary/20 shadow-primary/5",
        amber: "text-warning bg-warning/10 border-warning/20 shadow-warning/5",
        emerald: "text-success bg-success/10 border-success/20 shadow-success/5",
        rose: "text-error bg-error/10 border-error/20 shadow-error/5",
    };

    return (
        <div className={`p-6 bg-surface/50 backdrop-blur-xl border rounded-3xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-surface group ${colors[color]}`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${colors[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <button className="p-2 text-text-secondary hover:text-text-primary rounded-lg transition-colors">
                    <ArrowUpRight className="w-5 h-5" />
                </button>
            </div>
            <div>
                <p className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">{title}</p>
                <div className="flex items-end gap-2 mt-1">
                    <h3 className="text-4xl font-bold text-text-primary tracking-tight">{value}</h3>
                </div>
                <p className="text-xs text-text-secondary mt-3 font-medium flex items-center gap-1.5">
                    <span className={colors[color].split(" ")[0]}>{trend}</span>
                </p>
            </div>
        </div>
    );
}
