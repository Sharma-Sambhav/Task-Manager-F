'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CreateProjectData } from '@/types/project';
import projectService from '@/services/projectService';
import ProjectForm from '@/components/project/ProjectForm';
import Loader from '@/components/common/Loader';
import { ChevronLeft, Rocket } from 'lucide-react';

const NewProjectPage = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: any) => {
        try {
            setLoading(true);
            const project = await projectService.createProject(data);
            toast.success('Project mission initiated successfully');
            router.push(`/admin/projects/${project._id}`);
        } catch (error: any) {
            console.error('Create project error:', error);
            toast.error(error.message || 'Failed to initiate project');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/admin/projects');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="space-y-6">
                    <button 
                        onClick={handleCancel}
                        className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors group"
                    >
                        <div className="p-1.5 bg-surface border border-border-theme rounded-lg group-hover:border-primary/30 transition-all">
                            <ChevronLeft className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-wider">Cancel Deployment</span>
                    </button>

                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-primary/10 rounded-[1.5rem] border border-primary/20 shadow-xl shadow-primary/5">
                            <Rocket className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-text-primary tracking-tight">
                                New Project Mission
                            </h1>
                            <p className="text-text-secondary font-medium">
                                Configure the operational parameters for your team's next objective.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-surface/50 backdrop-blur-xl border border-border-theme rounded-[2.5rem] p-10 shadow-2xl shadow-black/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="relative z-10">
                        <ProjectForm
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            loading={loading}
                            mode="create"
                        />
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-secondary/50 border border-border-theme rounded-2xl p-6 flex gap-4 items-start">
                    <div className="p-2 bg-background rounded-xl border border-border-theme mt-1">
                        <Rocket className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-text-primary mb-1">Mission Ready?</p>
                        <p className="text-xs text-text-secondary leading-relaxed">
                            Once initiated, you can deploy team members and start allocating tasks. All mission data is tracked in real-time within your portfolio dashboard.
                        </p>
                    </div>
            </div>
        </div>
    );
};

export default NewProjectPage;