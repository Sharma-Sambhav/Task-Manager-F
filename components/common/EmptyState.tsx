import React from 'react';

interface EmptyStateProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    action,
    icon,
    className = ""
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
            {icon && (
                <div className="mb-4 text-gray-400 dark:text-gray-600">
                    {icon}
                </div>
            )}
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>
            
            {description && (
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                    {description}
                </p>
            )}
            
            {action && (
                <div>
                    {action}
                </div>
            )}
        </div>
    );
};

export default EmptyState;