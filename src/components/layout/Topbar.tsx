import React from 'react';
import { Search, Bell, Settings, Menu } from 'lucide-react';
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
  const title = titleOverride || (isDoctor ? 'Clinical Dashboard' : 'Patient Portal');
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).toUpperCase();

  return (
    <header className="sticky top-0 z-30 bg-[#fef9f1]/90 backdrop-blur-md border-b border-[#e7e2da] h-16 px-4 md:px-8 flex items-center justify-between shadow-[0_2px_12px_rgba(75,68,57,0.06)]">
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-[#444655] hover:bg-[#f2ede5] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex flex-col">
          <h2 className="font-serif-display font-normal text-lg md:text-xl text-[#1d1c17] leading-tight">
            {title}
          </h2>
          <span className="text-[10px] md:text-[11px] text-[#757687] font-semibold tracking-wider">
            {subtitleOverride || dateStr}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* Search Bar */}
        <div className="relative w-40 sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#757687]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patients, records..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#f2ede5] border border-[#e7e2da] rounded-full text-xs md:text-sm text-[#1d1c17] placeholder:text-[#757687] focus:outline-none focus:ring-2 focus:ring-[#2849e5] focus:bg-white transition-all"
          />
        </div>

        {/* Notifications & Settings Icons */}
        <div className="flex items-center gap-1 md:gap-2">
          <button className="p-2 rounded-full text-[#444655] hover:text-[#2849e5] hover:bg-[#dee0ff]/50 relative transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full border border-white"></span>
          </button>
          <button className="p-2 rounded-full text-[#444655] hover:text-[#2849e5] hover:bg-[#dee0ff]/50 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
