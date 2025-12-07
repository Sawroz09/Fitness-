import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-8 flex justify-between items-center bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-600 to-cyan-500 flex items-center justify-center neon-border">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 neon-text">
          FitMinute <span className="text-gray-500 text-sm font-normal ml-2 tracking-normal">| Nano Editor</span>
        </h1>
      </div>
      <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-400">
        <span className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Gemini 2.5 Flash Image Active
        </span>
      </div>
    </header>
  );
};

export default Header;
