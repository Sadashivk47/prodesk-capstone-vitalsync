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
  CreditCard,
} from 'lucide-react';

interface SidebarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const isDoctor = user.role === 'doctor';

  const doctorNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'availability', label: 'Availability', icon: Clock },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
    { id: 'billing', label: 'Billing & Dues', icon: CreditCard },
  ];

  const patientNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'My appointments', icon: Calendar },
    { id: 'book', label: 'Book appointment', icon: PlusCircle },
    { id: 'history', label: 'Medical history', icon: History },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
    { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
  ];

  const navItems = isDoctor ? doctorNavItems : patientNavItems;

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-[#fef9f1] border-r border-[#e7e2da] flex flex-col p-4 z-40 hidden md:flex shadow-warm-md">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 mb-8 pt-2">
        <div className="w-10 h-10 bg-[#2849e5] rounded-xl flex items-center justify-center shadow-warm-md">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-serif-display font-normal text-xl text-[#1d1c17] leading-none">VitalSync</h1>
          <p className="text-[10px] uppercase tracking-widest text-[#757687] font-semibold mt-0.5">
            {isDoctor ? 'Clinical Portal' : 'Patient Access'}
          </p>
        </div>
      </div>

      {/* Role Badge */}
      <div className="mx-2 mb-6 p-2.5 bg-white border border-[#e7e2da] rounded-xl flex items-center justify-between text-xs shadow-xs">
        <span className="font-medium text-[#444655] flex items-center gap-1.5">
          <span>Account Role:</span>
          <strong className="text-[#2849e5] uppercase px-2 py-0.5 bg-[#dee0ff] border border-[#a2baff]/40 rounded-full text-[11px] font-bold">
            {user.role}
          </strong>
        </span>
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#dee0ff] text-[#2849e5] font-semibold shadow-xs'
                  : 'text-[#444655] hover:text-[#2849e5] hover:bg-[#f2ede5]'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#2849e5]' : 'text-[#757687]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Profile Card */}
      <div className="mt-auto border-t border-[#e7e2da] pt-4">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="relative">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100'}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#e7e2da]"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="overflow-hidden">
            <p className="font-semibold text-xs text-[#1d1c17] truncate">{user.name}</p>
            <p className="text-[10px] text-[#757687] truncate">{user.title || (isDoctor ? 'Lead Physician' : 'Patient')}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#ba1a1a] hover:bg-[#ffdad6]/40 font-semibold text-sm transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-[#ba1a1a]" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
