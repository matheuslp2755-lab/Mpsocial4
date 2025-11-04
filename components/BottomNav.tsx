import React from 'react';
import { View } from '../types';
import { HomeIcon, CompassIcon, PlusIcon, ChatIcon, UserIcon } from './icons/Icon';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
  t: (key: any) => string;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView, t }) => {
  const navItems = [
    { view: View.Feed, icon: HomeIcon, label: t('nav_feed') },
    { view: View.Explore, icon: CompassIcon, label: t('nav_explore') },
    { view: View.Create, icon: PlusIcon, label: t('nav_create') },
    { view: View.Chat, icon: ChatIcon, label: t('nav_chat') },
    { view: View.Profile, icon: UserIcon, label: t('nav_profile') },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto">
      <div className="bg-nexus-gray/80 backdrop-blur-lg px-6 py-3 border-t border-nexus-light-gray">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className="focus:outline-none"
                aria-label={item.label}
              >
                <IconComponent active={isActive} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;