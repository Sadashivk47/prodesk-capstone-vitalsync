import React from 'react';
import { Search, Bell, Settings, Stethoscope, UserCheck, Menu } from 'lucide-react';
import { User } from '../../types';

interface TopbarProps {
  user: User;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenMobileMenu?: () => void;
  titleOverride?: string;
  subtitleOverride?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  user,
  searchQuery,
  setSearchQuery,
  onOpenMobileMenu,
  titleOverride,
  subtitleOverride,
}) => {
  const isDoctor = user.role === 'doctor';
  const title = titleOverride || (isDoctor ? 'VitalSync Dashboard' : 'VitalSync Portal');
  const dateStr = 'TUESDAY, OCTOBER 24, 2024';

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 px-4 md:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex flex-col">
          <h2 className="font-bold text-lg md:text-xl text-teal-900 leading-tight">
            {title}
          </h2>
          <span className="text-[10px] md:text-[11px] text-slate-400 font-semibold tracking-wider">
            {subtitleOverride || dateStr}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Search Bar */}
        <div className="relative w-40 sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patients, records..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:bg-white transition-all"
          />
        </div>

        {/* Notifications & Settings Icons */}
        <div className="flex items-center gap-1 md:gap-2">
          <button className="p-2 rounded-full text-slate-600 hover:text-teal-800 hover:bg-slate-100 relative transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
          </button>
          <button className="p-2 rounded-full text-slate-600 hover:text-teal-800 hover:bg-slate-100 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
