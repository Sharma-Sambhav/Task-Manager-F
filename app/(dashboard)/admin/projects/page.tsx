'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Project, ProjectFilters } from '@/types/project';
import { useAuth } from '@/hooks/useAuth';
import projectService from '@/services/projectService';
import ProjectCard from '@/components/project/ProjectCard';
import Button from '@/components/common/Button';
import Loader from '@/components/common/Loader';
import ConfirmModal from '@/components/common/ConfirmModal';
import { 
    Search, 
    Filter, 
    Plus, 
    FolderKanban,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal
} from 'lucide-react';

const ProjectsPage = () => {
    const router = useRouter();
    const { user } = useAuth();
    
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled' | 'overdue' | 'archived'>('all');
    const [sortBy, setSortBy] = useState('-createdAt');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    
    // Action states
    const [deletingProject, setDeletingProject] = useState<Project | null>(null);
    const [archivingProject, setArchivingProject] = useState<Project | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const limit = 9;

    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            
            const filters: ProjectFilters = {
                sort: sortBy,
                limit,
                page
            };

            if (statusFilter !== 'all') {
                filters.status = statusFilter;
            }

            let result;
            if (searchQuery.trim()) {
                result = await projectService.searchProjects({
                    ...filters,
                    q: searchQuery.trim()
                });
            } else {
                result = await projectService.getProjects(filters);
            }

            setProjects(result.projects);
            setTotal(result.total);
            setTotalPages(Math.ceil(result.total / limit));
        } catch (error: any) {
            console.error('Fetch projects error:', error);
            toast.error(error.message || 'Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    }, [searchQuery, statusFilter, sortBy, page]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Reset page when filters change
    useEffect(() => {
        if (page !== 1) {
            setPage(1);
        }
    }, [searchQuery, statusFilter, sortBy]);

    const handleCreateProject = () => {
        router.push('/admin/projects/new');
    };

    const handleEditProject = (project: Project) => {
        router.push(`/admin/projects/${project._id}/edit`);
    };

    const handleDeleteProject = async () => {
        if (!deletingProject) return;

        try {
            setActionLoading(true);
            await projectService.deleteProject(deletingProject._id);
            toast.success('Project deleted successfully');
            setDeletingProject(null);
            fetchProjects();
        } catch (error: any) {
            console.error('Delete project error:', error);
            toast.error(error.message || 'Failed to delete project');
        } finally {
            setActionLoading(false);
        }
    };

    const handleArchiveProject = async () => {
        if (!archivingProject) return;

        try {
            setActionLoading(true);
            await projectService.archiveProject(archivingProject._id);
            toast.success('Project archived successfully');
            setArchivingProject(null);
            fetchProjects();
        } catch (error: any) {
            console.error('Archive project error:', error);
            toast.error(error.message || 'Failed to archive project');
        } finally {
            setActionLoading(false);
        }
    };

    const isCreator = (project: Project) => {
        return user && project.createdBy._id === user._id;
    };

    const isAppAdmin = () => {
        return user?.role === 'admin';
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <div className="space-y-8 animate-in fade-in duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <FolderKanban className="w-6 h-6 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold text-text-primary tracking-tight">
                                Project Portfolio
                            </h1>
                        </div>
                        <p className="text-text-secondary">
                            Orchestrate your team's initiatives and track real-time progress.
                        </p>
                    </div>
                    <button 
                        onClick={handleCreateProject}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl hover:opacity-90 transition-all font-bold shadow-xl shadow-primary/20 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        Initiate Project
                    </button>
                </div>

                {/* Glassmorphic Filters */}
                <div className="bg-surface/50 backdrop-blur-xl border border-border-theme rounded-3xl p-6 shadow-xl shadow-black/5">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="lg:col-span-2 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search project title or description..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full bg-background border border-border-theme rounded-2xl pl-12 pr-4 py-3 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="w-full bg-background border border-border-theme rounded-2xl pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                            >
                                <option value="all">All Statuses</option>
                                <option value="planning">Planning</option>
                                <option value="active">Active</option>
                                <option value="on_hold">On Hold</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="overdue">Overdue</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full bg-background border border-border-theme rounded-2xl pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                            >
                                <option value="-createdAt">Recently Created</option>
                                <option value="createdAt">Oldest First</option>
                                <option value="name">Name (A-Z)</option>
                                <option value="-name">Name (Z-A)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                {!loading && (
                    <div className="flex items-center gap-2 text-sm text-text-secondary px-2">
                        <span className="font-bold text-text-primary">{total}</span> 
                        <span>projects identified</span>
                        {searchQuery && (
                            <>
                                <span className="mx-2 text-border-theme">|</span>
                                <span>Filtering by "<span className="text-primary font-medium">{searchQuery}</span>"</span>
                            </>
                        )}
                    </div>
                )}

                {/* Projects Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader size="lg" />
                        <p className="text-text-secondary animate-pulse">Syncing your portfolio...</p>
                    </div>
                ) : projects.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project._id}
                                    project={project}
                                    onEdit={handleEditProject}
                                    onDelete={setDeletingProject}
                                    onArchive={setArchivingProject}
                                    isCreator={!!isCreator(project)}
                                    isAppAdmin={!!isAppAdmin()}
                                    href={`/admin/projects/${project._id}`}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 pt-10">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className="p-2 bg-surface border border-border-theme rounded-xl text-text-secondary disabled:opacity-30 hover:text-primary transition-colors active:scale-90"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                
                                <div className="px-6 py-2 bg-surface border border-border-theme rounded-2xl text-sm font-bold text-text-primary">
                                    {page} <span className="text-text-secondary mx-1">of</span> {totalPages}
                                </div>
                                
                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                    className="p-2 bg-surface border border-border-theme rounded-xl text-text-secondary disabled:opacity-30 hover:text-primary transition-colors active:scale-90"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-surface/30 backdrop-blur-xl border border-border-theme border-dashed rounded-[2.5rem] p-20 text-center">
                        <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <FolderKanban className="w-10 h-10 text-text-secondary opacity-50" />
                        </div>
                        <h3 className="text-2xl font-bold text-text-primary mb-2">
                            {searchQuery ? "No matching projects" : "Portfolio is empty"}
                        </h3>
                        <p className="text-text-secondary mb-8 max-w-sm mx-auto leading-relaxed">
                            {searchQuery 
                                ? `We couldn't find any projects matching "${searchQuery}". Try adjusting your filters.`
                                : "You haven't initiated any projects yet. Start by creating a new workspace for your team."
                            }
                        </p>
                        {!searchQuery && (
                            <button 
                                onClick={handleCreateProject}
                                className="px-8 py-3 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
                            >
                                Create First Project
                            </button>
                        )}
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={!!deletingProject}
                onClose={() => setDeletingProject(null)}
                onConfirm={handleDeleteProject}
                title="Terminate Project"
                message={`Are you sure you want to permanently delete "${deletingProject?.name}"? All associated data will be purged.`}
                confirmText="Terminate Now"
                type="danger"
                loading={actionLoading}
            />

            <ConfirmModal
                isOpen={!!archivingProject}
                onClose={() => setArchivingProject(null)}
                onConfirm={handleArchiveProject}
                title="Archive Project"
                message={`Move "${archivingProject?.name}" to archives? You can still access it later in the filters.`}
                confirmText="Archive Project"
                type="warning"
                loading={actionLoading}
            />
        </>
    );
};

export default ProjectsPage;