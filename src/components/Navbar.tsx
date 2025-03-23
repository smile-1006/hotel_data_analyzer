
import React from 'react';
import { cn } from "@/lib/utils";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 flex items-center justify-between",
      "h-16 px-6 backdrop-blur-lg bg-white/80 border-b border-gray-200/50",
      "transition-all duration-300 animate-fade-in",
      className
    )}>
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M14 19.9V16h3a2 2 0 0 0 2-2v-3c0-.6-.4-1-1-1.1-.3-.1-.7-.1-1 .1-.3.1-.4.1-.5.2-.2.1-.3.3-.3.6H16"></path>
            <path d="M16 8.8V9"></path>
            <path d="M8 9v9.9"></path>
            <path d="M8 5.1V5"></path>
            <path d="M2 11h18"></path>
            <path d="M5 11c-.6 0-1-.4-1-1 0-1 .8-1 2.5-3 1.8-2 1.8-3 1.8-3 .2-.8.7-1 1.7-1h4c1 0 1.5.2 1.7 1 0 0 0 1 1.8 3 1.7 2 2.5 2 2.5 3 0 .6-.4 1-1 1"></path>
          </svg>
        </div>
        <h1 className="text-xl font-medium">Hotel Analytics</h1>
      </div>
      
      <nav className="hidden md:flex items-center space-x-6">
        <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Dashboard</a>
        <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Revenue</a>
        <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Cancellations</a>
        <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Geography</a>
      </nav>
      
      <div className="flex items-center space-x-4">
        <button className="h-9 px-4 rounded-full text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors">
          Export
        </button>
        <button className="h-9 px-4 rounded-full text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors">
          Upload Data
        </button>
      </div>
    </header>
  );
};

export default Navbar;
