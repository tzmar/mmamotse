
import React from 'react';

export const Branding: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'lg' }) => {
  return (
    <div className={`flex flex-col items-start ${size === 'lg' ? 'mb-8 px-4' : 'px-2'}`}>
      <span className={`font-black tracking-tighter bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent animate-pulse-slow ${size === 'lg' ? 'text-4xl' : 'text-2xl'}`}>
        TZMAR
      </span>
      <span className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-40 ml-1">
        Premium Finance
      </span>
    </div>
  );
};
