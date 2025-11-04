
import React from 'react';

interface IconProps {
  children: React.ReactNode;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-7 h-7 flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
};

export const HomeIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <Icon>
    <i className={`fa-solid fa-house text-xl ${active ? 'text-white' : 'text-gray-400'}`}></i>
  </Icon>
);

export const CompassIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <Icon>
    <i className={`fa-regular fa-compass text-xl ${active ? 'text-white' : 'text-gray-400'}`}></i>
  </Icon>
);

export const PlusIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <div className="w-12 h-8 bg-gradient-to-r from-nexus-accent to-nexus-secondary rounded-lg flex items-center justify-center">
    <i className="fa-solid fa-plus text-white text-lg"></i>
  </div>
);

export const ChatIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <Icon>
    <i className={`fa-regular fa-paper-plane text-xl ${active ? 'text-white' : 'text-gray-400'}`}></i>
  </Icon>
);

export const UserIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <Icon>
    <i className={`fa-regular fa-user text-xl ${active ? 'text-white' : 'text-gray-400'}`}></i>
  </Icon>
);

export const SparklesIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm6 0a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0V6h-1a1 1 0 010-2h1V3a1 1 0 011-1zM3.293 8.293a1 1 0 010 1.414L2 11l1.293 1.293a1 1 0 11-1.414 1.414L.586 12.414a1 1 0 010-1.414L2.879 8.293a1 1 0 011.414 0zM17.414 9.707a1 1 0 010 1.414L15.121 13.707a1 1 0 01-1.414-1.414L16 11l-1.293-1.293a1 1 0 011.414-1.414l1.293 1.293zM9 10a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0v-1H7a1 1 0 010-2h1v-1a1 1 0 011-1zm-6 5a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 010-2h1v-1a1 1 0 011-1zm12 0a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 010-2h1v-1a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);
