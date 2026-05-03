"use client";

import { useAuth } from "@/hooks/useAuth";
import UserLayout from "@/components/layout/UserLayout";
import {
    LayoutDashboard,
    CheckSquare,
    Clock,
    CheckCircle2,
    ArrowUpRight,
    Plus
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FolderKanban } from "lucide-react";

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();

    return (
        <UserLayout>
            <div className="space-y-10 animate-in fade-in duration-700">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">
                            Welcome back, {user?.firstName}! 👋
                        </h1>
                        <p className="text-text-secondary mt-1">
                            Here's what's happening with your projects today.
                        </p>
                    </div>
                    {user?.role === 'admin' && (
                        <button
                            onClick={() => router.push('/admin/projects')}
                            className="flex items-center gap-2 px-4 py-2.5 bg-accent text-white rounded-xl hover:opacity-90 transition-all text-sm font-medium shadow-lg shadow-accent/20 active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            New Project
                        </button>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <UserStatCard
                        title="Active Projects"
                        value="0"
                        icon={LayoutDashboard}
                        color="blue"
                    />
                    <UserStatCard
                        title="Pending Tasks"
                        value="0"
                        icon={Clock}
                        color="amber"
                    />
                    <UserStatCard
                        title="Completed Tasks"
                        value="0"
                        icon={CheckCircle2}
                        color="emerald"
                    />
                    <UserStatCard
                        title="Productivity"
                        value="0%"
                        icon={CheckSquare}
                        color="purple"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Projects */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-text-primary">Recent Projects</h2>
                            <Link href="/projects" className="text-sm font-medium text-accent hover:underline">
                                View all
                            </Link>
                        </div>

                        <div className="bg-surface/50 backdrop-blur-xl border border-border-theme rounded-3xl p-12 text-center shadow-xl shadow-black/5">
                            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FolderKanban className="w-8 h-8 text-accent" />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary mb-2">No active assignments</h3>
                            <p className="text-text-secondary mb-6 max-w-xs mx-auto">
                                You haven't been assigned to any projects yet.
                            </p>
                        </div>
                    </div>

                    {/* Upcoming Deadlines / Notifications */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-text-primary">Recent Activity</h2>
                        <div className="bg-surface/50 backdrop-blur-xl border border-border-theme rounded-3xl p-6 shadow-xl shadow-black/5">
                            <div className="space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-4 animate-pulse">
                                        <div className="w-10 h-10 rounded-full bg-secondary shrink-0" />
                                        <div className="flex-1 space-y-2 py-1">
                                            <div className="h-4 bg-secondary rounded w-3/4" />
                                            <div className="h-3 bg-secondary rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                                <p className="text-center text-sm text-text-secondary py-4">
                                    No recent activity to show.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}

function UserStatCard({ title, value, icon: Icon, color }: any) {
    const colors: any = {
        blue: "text-accent bg-accent/10 border-accent/20",
        amber: "text-warning bg-warning/10 border-warning/20",
        emerald: "text-success bg-success/10 border-success/20",
        purple: "text-primary bg-primary/10 border-primary/20",
    };

    return (
        <div className="p-6 bg-surface/50 backdrop-blur-xl border border-border-theme rounded-3xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-surface group">
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
                <h3 className="text-3xl font-bold text-text-primary tracking-tight mt-1">{value}</h3>
            </div>
        </div>
    );
}
