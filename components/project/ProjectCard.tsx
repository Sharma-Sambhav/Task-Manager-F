import React from 'react';
import Link from 'next/link';
import { Project } from '@/types/project';
import StatusBadge from '../common/StatusBadge';
import { 
    Calendar, 
    Users, 
    Edit2, 
    Archive, 
    Trash2, 
    ArrowUpRight,
    Clock
} from 'lucide-react';

interface ProjectCardProps {
    project: Project;
    onEdit?: (project: Project) => void;
    onDelete?: (project: Project) => void;
    onArchive?: (project: Project) => void;
    isCreator?: boolean;
    isAppAdmin?: boolean;
    className?: string;
    href?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
    project,
    onEdit,
    onDelete,
    onArchive,
    isCreator = false,
    isAppAdmin = false,
    className = '',
    href
}) => {
    const canManage = isCreator || isAppAdmin;
    const memberAvatars = project.members.slice(0, 4);
    const remainingMembers = Math.max(0, project.members.length - 4);

    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    return (
        <div className={`
            group relative bg-surface/50 backdrop-blur-xl border border-border-theme rounded-3xl 
            hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1
            ${className}
        `}>
            {/* Top Gradient Bar */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100 bg-gradient-to-r ${
                project.status === 'active' ? 'from-success to-accent' :
                project.status === 'completed' ? 'from-accent to-primary' :
                'from-text-secondary to-border-theme'
            }`} />

            <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            <StatusBadge status={project.status} size="sm" />
                            {isCreator && (
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full ring-1 ring-primary/20">
                                    Creator
                                </span>
                            )}
                        </div>
                        {href ? (
                            <Link 
                                href={href}
                                className="group/link inline-flex items-center gap-2"
                            >
                                <h3 className="text-xl font-bold text-text-primary truncate group-hover/link:text-primary transition-colors">
                                    {project.name}
                                </h3>
                                <ArrowUpRight className="w-4 h-4 text-text-secondary opacity-0 -translate-y-1 translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 group-hover/link:translate-x-0 transition-all" />
                            </Link>
                        ) : (
                            <h3 className="text-xl font-bold text-text-primary truncate">
                                {project.name}
                            </h3>
                        )}
                        {project.description && (
                            <p className="text-text-secondary text-sm mt-2 line-clamp-2 leading-relaxed">
                                {project.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Project Info */}
                <div className="space-y-6">
                    {/* Timeline */}
                    <div className="flex items-center gap-4 py-4 border-y border-border-theme/50">
                        <div className="flex items-center text-xs text-text-secondary">
                            <Calendar className="w-3.5 h-3.5 mr-2 text-primary/60" />
                            <span>{formatDate(project.startDate)}</span>
                        </div>
                        <div className="h-px flex-1 bg-border-theme/50" />
                        <div className="flex items-center text-xs text-text-secondary">
                            <Clock className="w-3.5 h-3.5 mr-2 text-accent/60" />
                            <span>{formatDate(project.endDate)}</span>
                        </div>
                    </div>

                    {/* Members & Meta */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex -space-x-3">
                                {memberAvatars.map((member) => (
                                    <div
                                        key={member._id}
                                        className="w-9 h-9 rounded-full bg-surface border-2 border-background flex items-center justify-center shadow-sm"
                                        title={`${member.firstName} ${member.lastName}`}
                                    >
                                        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center ring-1 ring-inset ring-black/5">
                                            <span className="text-[10px] font-bold text-primary">
                                                {getInitials(member.firstName, member.lastName)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {remainingMembers > 0 && (
                                    <div className="w-9 h-9 rounded-full bg-surface border-2 border-background flex items-center justify-center shadow-sm">
                                        <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-text-secondary">
                                                +{remainingMembers}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="ml-4">
                                <p className="text-xs font-semibold text-text-primary">{project.members.length} Members</p>
                                <p className="text-[10px] text-text-secondary">Assigned team</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Overlay */}
                {canManage && (
                    <div className="flex items-center justify-end gap-2 mt-8 pt-6 border-t border-border-theme/50 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(project)}
                                className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                                title="Edit Project"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                        )}
                        
                        {onArchive && project.status === 'active' && (
                            <button
                                onClick={() => onArchive(project)}
                                className="p-2 text-text-secondary hover:text-warning hover:bg-warning/10 rounded-xl transition-all"
                                title="Archive Project"
                            >
                                <Archive className="w-4 h-4" />
                            </button>
                        )}
                        
                        {onDelete && (
                            <button
                                onClick={() => onDelete(project)}
                                className="p-2 text-text-secondary hover:text-error hover:bg-error/10 rounded-xl transition-all"
                                title="Delete Project"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectCard;