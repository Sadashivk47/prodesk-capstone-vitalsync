import React, { useState, useMemo } from 'react';
import { User, Appointment, AvailabilitySlot, ClinicalFeedItem } from '../../types';
import {
  Calendar,
  Clock,
  FileText,
  Plus,
  Trash2,
  ListFilter,
  PlusCircle,
  MoreVertical,
  Bot,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface DoctorDashboardProps {
  user: User;
  appointments: Appointment[];
  availabilitySlots: AvailabilitySlot[];
  clinicalFeed: ClinicalFeedItem[];
  onViewPatientRecord: (patientId: string) => void;
  onOpenAddSlot: () => void;
  onDeleteSlot: (slotId: string) => void;
  onOpenNewPatientModal: () => void;
  onOpenAiAssist: () => void;
  searchQuery: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  user,
  appointments,
  availabilitySlots,
  clinicalFeed,
  onViewPatientRecord,
  onOpenAddSlot,
  onDeleteSlot,
  onOpenNewPatientModal,
  onOpenAiAssist,
  searchQuery,
}) => {
  const greeting = useMemo(() => {
    const salutation = getGreeting();
    const prefix = user.role === 'doctor' ? 'Dr. ' : '';
    const displayName = user.name || 'Loading…';
    return `${salutation}, ${prefix}${displayName}`;
  }, [user.name, user.role]);
  const filteredAppointments = appointments.filter(
    (app) =>
      app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto pb-24 md:pb-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
            {greeting}
          </h3>
          <p className="text-slate-500 text-sm md:text-base mt-1">
            You have a busy schedule today with {appointments.length} appointments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAiAssist}
            className="bg-teal-50 text-teal-800 border border-teal-200 px-4 py-2.5 rounded-lg flex items-center gap-2 font-bold text-xs md:text-sm hover:bg-teal-100 transition-all cursor-pointer shadow-xs"
          >
            <Bot className="w-4 h-4 text-teal-700" />
            AI Clinical Assist
          </button>
          <button
            onClick={onOpenNewPatientModal}
            className="bg-teal-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold text-xs md:text-sm hover:bg-teal-900 active:scale-[0.98] transition-all cursor-pointer shadow-sm shadow-teal-900/10"
          >
            <PlusCircle className="w-4 h-4" />
            NEW PATIENT ENTRY
          </button>
        </div>
      </div>

      {/* Summary Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 hover:border-teal-300 transition-colors shadow-xs">
          <div className="w-14 h-14 bg-teal-50 text-teal-800 rounded-xl flex items-center justify-center shrink-0">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Today's Appointments
            </p>
            <p className="text-3xl font-extrabold text-slate-900 mt-0.5">12</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 hover:border-teal-300 transition-colors shadow-xs">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-800 rounded-xl flex items-center justify-center shrink-0">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Open Slots This Week
            </p>
            <p className="text-3xl font-extrabold text-slate-900 mt-0.5">5</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 hover:border-teal-300 transition-colors shadow-xs">
          <div className="w-14 h-14 bg-rose-50 text-rose-700 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pending Prescriptions
            </p>
            <p className="text-3xl font-extrabold text-slate-900 mt-0.5">8</p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Appointments Table (8 Columns) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-xs">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-2">
              <ListFilter className="w-5 h-5 text-teal-800" />
              <h4 className="font-bold text-lg text-slate-900">Today's Appointments</h4>
            </div>
            <button className="text-teal-800 text-xs font-bold hover:underline cursor-pointer">
              View All Schedule
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3">Patient Name</th>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Reason for visit</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-teal-50/30 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-900 font-bold flex items-center justify-center text-xs">
                            {item.patientInitials}
                          </div>
                          <span>{item.patientName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-mono text-xs">{item.time}</td>
                      <td className="px-6 py-4 text-slate-600">{item.reason}</td>
                      <td className="px-6 py-4">
                        {item.status === 'SCHEDULED' && (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Scheduled
                          </span>
                        )}
                        {item.status === 'COMPLETED' && (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200">
                            Completed
                          </span>
                        )}
                        {item.status === 'CANCELLED' && (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
                            Cancelled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => onViewPatientRecord(item.patientId)}
                          className="px-4 py-1.5 border border-teal-700 text-teal-800 hover:bg-teal-800 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                      No appointments matching search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50/50 border-t border-slate-200 flex justify-center">
            <button className="text-slate-400 hover:text-slate-700 text-xs font-medium flex items-center gap-1 cursor-pointer">
              Scroll for more <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Manage Availability & Clinical Feed (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Manage Availability */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-700" />
                Manage Availability
              </h4>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Upcoming Slots
            </p>

            <div className="space-y-2.5 mb-4">
              {availabilitySlots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex justify-between items-center group hover:bg-teal-50/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-teal-700 rounded-full"></div>
                    <span className="font-mono text-xs font-semibold text-slate-800">
                      {slot.timeRange}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteSlot(slot.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    title="Delete slot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={onOpenAddSlot}
              className="w-full py-2.5 border-2 border-dashed border-slate-200 text-slate-500 hover:border-teal-700 hover:text-teal-800 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Slot
            </button>
          </div>

          {/* Clinical Feed */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h4 className="font-bold text-slate-900 mb-4">Clinical Feed</h4>
            <div className="relative pl-6 space-y-5 before:absolute before:left-[10px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
              {clinicalFeed.map((item) => (
                <div key={item.id} className="relative">
                  <div
                    className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      item.type === 'lab'
                        ? 'bg-teal-700'
                        : item.type === 'urgent'
                        ? 'bg-rose-600'
                        : 'bg-slate-400'
                    }`}
                  ></div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {item.time}
                  </p>
                  <p className="text-xs text-slate-800 mt-0.5 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={onOpenNewPatientModal}
        className="fixed bottom-6 right-6 w-14 h-14 bg-teal-800 text-white rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center group cursor-pointer z-20"
        title="Quick Appointment"
      >
        <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
};
