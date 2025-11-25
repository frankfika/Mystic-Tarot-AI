import React from 'react';

export const LoadingOrb: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-mystic-purple blur-xl animate-pulse"></div>
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-mystic-gold border-t-transparent animate-spin"></div>
        <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white blur-md animate-pulse"></div>
      </div>
      <p className="font-serif text-mystic-gold animate-pulse text-lg">Consulting the Oracle...</p>
    </div>
  );
};
