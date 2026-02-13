import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const baseStyles =
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

  const variants = {
    default: 'bg-blue-600/20 text-blue-200 border border-blue-500/30',
    success: 'bg-emerald-600/20 text-emerald-200 border border-emerald-500/30',
    warning: 'bg-amber-600/20 text-amber-200 border border-amber-500/30',
    danger: 'bg-red-600/20 text-red-200 border border-red-500/30',
    outline: 'text-slate-400 border border-slate-700',
  };

  return <span className={`${baseStyles} ${variants[variant]} ${className}`}>{children}</span>;
};
