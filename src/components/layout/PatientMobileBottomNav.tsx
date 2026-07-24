import React from 'react';
import { LayoutDashboard, Calendar, PlusCircle, History, Pill } from 'lucide-react';

interface PatientMobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const PatientMobileBottomNav: React.FC<PatientMobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appts', icon: Calendar },
    { id: 'book', label: 'Book', icon: PlusCircle },
    { id: 'history', label: 'History', icon: History },
    { id: 'prescriptions', label: 'Scripts', icon: Pill },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1 px-2 flex justify-around items-center md:hidden shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-full transition-all ${
              isActive
                ? 'bg-teal-100 text-teal-900 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-teal-800' : 'text-slate-500'}`} />
            <span className="text-[10px] font-semibold mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
