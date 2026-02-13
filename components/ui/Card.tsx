import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'glass' | 'danger';
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    variant = 'default',
    ...props
}) => {
    const baseStyles = "rounded-xl p-4 transition-all duration-200 border";

    const variants = {
        default: "bg-slate-800/50 border-slate-700 text-white",
        glass: "bg-white/10 backdrop-blur-md border-white/20 text-white shadow-lg",
        danger: "bg-red-500/10 border-red-500/50 text-red-100"
    };

    return (
        <div
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
