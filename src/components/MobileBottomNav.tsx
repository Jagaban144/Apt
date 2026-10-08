import React from 'react';
import { Compass, Heart, CalendarDays, User as UserIcon, Layers, Building2 } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'search' | 'wishlists' | 'bookings' | 'host' | 'architecture';
  onSelectTab: (tab: 'search' | 'wishlists' | 'bookings' | 'host' | 'architecture') => void;
  savedCount: number;
  bookingsCount: number;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  savedCount,
  bookingsCount,
  onOpenAuth,
  isLoggedIn,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-2xl">
      <button
        onClick={() => onSelectTab('search')}
        className={`flex flex-col items-center justify-center space-y-1 transition ${
          currentTab === 'search' ? 'text-blue-600 font-bold' : 'text-slate-500'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px]">Search</span>
      </button>

      <button
        onClick={() => onSelectTab('wishlists')}
        className={`flex flex-col items-center justify-center space-y-1 transition relative ${
          currentTab === 'wishlists' ? 'text-blue-600 font-bold' : 'text-slate-500'
        }`}
      >
        <div className="relative">
          <Heart className="w-5 h-5" />
          {savedCount > 0 && (
            <span className="absolute -top-1 -right-2 px-1 py-0.1 bg-rose-500 text-white rounded-full text-[9px] font-bold">
              {savedCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">Saved</span>
      </button>

      <button
        onClick={() => onSelectTab('bookings')}
        className={`flex flex-col items-center justify-center space-y-1 transition relative ${
          currentTab === 'bookings' ? 'text-blue-600 font-bold' : 'text-slate-500'
        }`}
      >
        <div className="relative">
          <CalendarDays className="w-5 h-5" />
          {bookingsCount > 0 && (
            <span className="absolute -top-1 -right-2 px-1 py-0.1 bg-emerald-500 text-white rounded-full text-[9px] font-bold">
              {bookingsCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">My Stays</span>
      </button>

      <button
        onClick={() => onSelectTab('host')}
        className={`flex flex-col items-center justify-center space-y-1 transition ${
          currentTab === 'host' ? 'text-blue-600 font-bold' : 'text-slate-500'
        }`}
      >
        <Building2 className="w-5 h-5" />
        <span className="text-[10px]">Host</span>
      </button>

      <button
        onClick={() => onSelectTab('architecture')}
        className={`flex flex-col items-center justify-center space-y-1 transition ${
          currentTab === 'architecture' ? 'text-blue-600 font-bold' : 'text-slate-500'
        }`}
      >
        <Layers className="w-5 h-5" />
        <span className="text-[10px]">Spec</span>
      </button>
    </nav>
  );
};
