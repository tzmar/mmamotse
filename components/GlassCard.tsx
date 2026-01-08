
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`glass rounded-[2rem] p-6 shadow-2xl transition-all duration-300 ${className}`}>
      {children}
    </div>
  );
};
