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
import { FolderKanban, Loader2 } from "lucide-react";
import React, { useState, useEffect } from 'react';
import projectService from "@/services/projectService";
import taskService from "@/services/taskService";
import { Project } from "@/types/project";
import { Task } from "@/types/task";

export default function DashboardPage() {
    const { user } = useAuth();
    const router = useRouter();

    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [projectsData, tasksData] = await Promise.all([
                projectService.getProjects({ limit: 5 }),
                taskService.getUserAllTasks({ assignedToMe: true })
            ]);
            setProjects(projectsData.projects);
            setTasks(tasksData);
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const stats = {
        activeProjects: projects.filter(p => p.status === 'active').length,
        pendingTasks: tasks.filter(t => t.status !== 'done').length,
        completedTasks: tasks.filter(t => t.status === 'done').length,
        productivity: tasks.length > 0 
            ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) 
            : 0
    };

    return (
        <UserLayout>
            <div className="space-y-10 animate-in fade-in duration-700">
                {/* Welcome Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text-primary tracking-tight">
                            Welcome back, {user?.firstName}! 👋
                        </h1>
                        <p className="text-sm sm:text-base text-text-secondary mt-1 font-medium">
                            Here's what's happening with your projects today.
                        </p>
                    </div>
                    {user?.role === 'admin' && (
                        <button
                            onClick={() => router.push('/admin/projects/new')}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-white rounded-2xl hover:opacity-90 transition-all text-sm font-black shadow-2xl shadow-accent/20 active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                            New Project
                        </button>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <UserStatCard
                        title="Active Projects"
                        value={loading ? "..." : stats.activeProjects}
                        icon={LayoutDashboard}
                        color="blue"
                    />
                    <UserStatCard
                        title="Pending Tasks"
                        value={loading ? "..." : stats.pendingTasks}
                        icon={Clock}
                        color="amber"
                    />
                    <UserStatCard
                        title="Completed Tasks"
                        value={loading ? "..." : stats.completedTasks}
                        icon={CheckCircle2}
                        color="emerald"
                    />
                    <UserStatCard
                        title="Productivity"
                        value={loading ? "..." : `${stats.productivity}%`}
                        icon={CheckSquare}
                        color="purple"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Projects */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-text-primary">Recent Projects</h2>
                            <Link href="/projects" className="text-sm font-medium text-accent hover:underline">
                                View all
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                <div className="flex items-center justify-center p-12">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                </div>
                            ) : projects.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {projects.map(project => (
                                        <Link 
                                            key={project._id}
                                            href={user?.role === 'admin' ? `/admin/projects/${project._id}` : `/projects/${project._id}`}
                                            className="block p-6 bg-surface/50 border border-border-theme rounded-3xl hover:bg-surface hover:scale-[1.01] transition-all group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                                        <FolderKanban className="w-6 h-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors">
                                                            {project.name}
                                                        </h3>
                                                        <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
                                                            {project.description || 'No description provided'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                        project.status === 'active' ? 'bg-success/10 border-success/20 text-success' : 'bg-warning/10 border-warning/20 text-warning'
                                                    }`}>
                                                        {project.status.replace('_', ' ')}
                                                    </div>
                                                    <ArrowUpRight className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-surface/50 backdrop-blur-xl border border-border-theme rounded-3xl p-12 text-center shadow-xl shadow-black/5">
                                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <FolderKanban className="w-8 h-8 text-accent" />
                                    </div>
                                    <h3 className="text-lg font-bold text-text-primary mb-2">No active assignments</h3>
                                    <p className="text-text-secondary mb-6 max-w-xs mx-auto">
                                        You haven't been assigned to any projects yet.
                                    </p>
                                </div>
                            )}
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
                    {/* <ArrowUpRight className="w-5 h-5" /> */}
                </button>
            </div>
            <div>
                <p className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">{title}</p>
                <h3 className="text-3xl font-bold text-text-primary tracking-tight mt-1">{value}</h3>
            </div>
        </div>
    );
}
