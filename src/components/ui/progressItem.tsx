import React, { ReactElement } from 'react';

interface ProgressItemProps {
    icon: ReactElement<{ size?: number; color?: string; strokeWidth?: number }>;
    label?: string;
    hint?: string;
    state?: 'active' | 'inactive';
    variant?: 'default' | 'step';
}

const ProgressItem: React.FC<ProgressItemProps> = ({ 
    icon, 
    label, 
    hint, 
    state = 'inactive',
    variant = 'default' 
}) => {
    const isActive = state === 'active';
    const isStepVariant = variant === 'step';
    const borderColor = isActive ? 'border-primary' : 'border-border';
    const labelColor = isActive ? 'text-foreground font-semibold' : 'text-muted-foreground';
    const iconSize = 24; 
    const iconColor = isActive ? 'var(--primary)' : 'var(--muted-foreground)';
    const iconStrokeWidth = 1.5;

    const clonedIcon = React.cloneElement(icon, {
        size: iconSize,
        color: iconColor,
        strokeWidth: iconStrokeWidth
    });

    return (
        <div className='flex gap-2 items-center'>
            <div className={`
                w-fit h-fit bg-background rounded-sm border ${borderColor} 
                ${isActive ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer' : 'cursor-not-allowed'} 
                ${isStepVariant ? 'p-3' : 'p-2'}
            `}>
                {clonedIcon}
            </div>
            <div className="flex flex-col justify-center gap-[2px]">
                <div className={`font-medium ${labelColor}`}>
                    {label}
                </div>
                {hint && <div className="text-sm text-muted-foreground">{hint}</div>}
            </div>
        </div>
    );
};

export default ProgressItem;