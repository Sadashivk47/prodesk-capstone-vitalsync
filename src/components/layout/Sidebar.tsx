import React from 'react';
import { User, Role } from '../../types';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Users,
  FileText,
  PlusCircle,
  History,
  Pill,
  LogOut,
  Activity,
} from 'lucide-react';

interface SidebarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onSwitchRole: (role: Role) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onLogout,
  onSwitchRole,
}) => {
  const isDoctor = user.role === 'doctor';

  const doctorNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'availability', label: 'Availability', icon: Clock },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
  ];

  const patientNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'My appointments', icon: Calendar },
    { id: 'book', label: 'Book appointment', icon: PlusCircle },
    { id: 'history', label: 'Medical history', icon: History },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
  ];

  const navItems = isDoctor ? doctorNavItems : patientNavItems;

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-white border-r border-slate-200 flex flex-col p-4 z-40 hidden md:flex">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 bg-teal-800 text-teal-300 rounded-xl flex items-center justify-center shadow-sm">
          <Activity className="w-6 h-6 text-teal-300" />
        </div>
        <div>
          <h1 className="font-bold text-xl text-teal-900 leading-none">VitalSync</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">
            {isDoctor ? 'Clinical Portal' : 'Patient Access'}
          </p>
        </div>
      </div>

      {/* Role Switcher Badge / Quick Demo Switch */}
      <div className="mx-2 mb-6 p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600">
          Role: <strong className="text-teal-800 uppercase">{user.role}</strong>
        </span>
        <button
          onClick={() => onSwitchRole(isDoctor ? 'patient' : 'doctor')}
          className="text-[11px] font-bold text-teal-800 hover:bg-teal-100/60 px-2 py-1 rounded transition-colors"
          title="Switch view to test other role"
        >
          Switch to {isDoctor ? 'Patient' : 'Doctor'}
        </button>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-teal-100/70 text-teal-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-teal-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-teal-800' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Profile Card */}
      <div className="mt-auto border-t border-slate-200 pt-4">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="relative">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100'}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-xs text-slate-900 truncate">{user.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{user.title || (isDoctor ? 'Lead Physician' : 'Patient')}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-rose-600 hover:bg-rose-50 font-bold text-sm transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
