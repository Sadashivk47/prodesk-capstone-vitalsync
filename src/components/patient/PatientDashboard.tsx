import React from 'react';
import { Appointment, Prescription, Biometrics } from '../../types';
import {
  ArrowRight,
  Calendar,
  Pill,
  Heart,
  Scale,
  Footprints,
  ChevronRight,
  Activity,
  Bot,
  Stethoscope,
  UserCheck,
} from 'lucide-react';

interface PatientDashboardProps {
  upcomingAppointments: Appointment[];
  prescriptions: Prescription[];
  biometrics: Biometrics;
  onOpenBookAppointment: () => void;
  onCancelAppointment: (id: string) => void;
  onViewAllPrescriptions: () => void;
  onOpenAiAssist: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  upcomingAppointments,
  prescriptions,
  biometrics,
  onOpenBookAppointment,
  onCancelAppointment,
  onViewAllPrescriptions,
  onOpenAiAssist,
}) => {
  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto pb-28 md:pb-8">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-teal-900">Welcome back, Sarah</h2>
          <p className="text-slate-500 text-sm md:text-base mt-0.5">
            Here is a summary of your health status today.
          </p>
        </div>
        <button
          onClick={onOpenAiAssist}
          className="self-start md:self-auto bg-teal-50 text-teal-800 border border-teal-200 px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-xs md:text-sm hover:bg-teal-100 transition-colors shadow-xs cursor-pointer"
        >
          <Bot className="w-4 h-4 text-teal-700" />
          Ask AI Health Assistant
        </button>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Featured CTA Banner (Quick Action) */}
        <section className="col-span-12 relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-xs">
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="inline-block px-3 py-1 bg-teal-100 text-teal-900 font-bold text-xs rounded-full">
              Quick Action
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900">
              Ready for your next check-up?
            </h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Connect with your care team. Schedule a virtual or in-person visit with our specialists in just a few clicks.
            </p>
            <button
              onClick={onOpenBookAppointment}
              className="mt-2 px-6 py-3 bg-teal-800 text-white font-bold rounded-lg hover:bg-teal-900 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-teal-900/10 text-sm"
            >
              <span>Schedule Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden lg:flex relative w-64 h-44 items-center justify-center">
            <div className="w-32 h-32 bg-teal-100 rounded-full blur-2xl absolute"></div>
            <div className="relative z-10 w-28 h-28 bg-gradient-to-br from-teal-800 to-teal-900 rounded-2xl shadow-xl flex items-center justify-center text-teal-200">
              <Calendar className="w-14 h-14" />
            </div>
          </div>
        </section>

        {/* Your Upcoming Appointments (8 Columns) */}
        <section className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-xs">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base md:text-lg">
              Your upcoming appointments
            </h3>
            <button
              onClick={onOpenBookAppointment}
              className="text-teal-800 font-bold text-xs hover:underline cursor-pointer"
            >
              Book New
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-800 shrink-0">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-slate-900">{appt.doctorName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {appt.specialty} • {appt.reason || appt.visitType}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-mono text-xs font-bold text-slate-900">{appt.date}</p>
                    <p className="text-xs text-slate-500">{appt.time}</p>
                  </div>
                  <button
                    onClick={() => onCancelAppointment(appt.id)}
                    className="px-3 py-1.5 text-rose-600 font-bold text-xs hover:bg-rose-50 rounded-lg transition-colors border border-rose-200/60 cursor-pointer self-end sm:self-auto"
                  >
                    Cancel
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                No upcoming appointments scheduled.
              </div>
            )}
          </div>
        </section>

        {/* Recent Prescriptions (4 Columns) */}
        <section className="col-span-12 lg:col-span-4 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-xs">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-base md:text-lg">
              Recent prescriptions
            </h3>
          </div>
          <div className="p-5 flex flex-col gap-3 flex-1">
            {prescriptions.map((rx) => (
              <div
                key={rx.id}
                className="p-4 rounded-lg bg-slate-50/80 border border-slate-200/80 hover:border-teal-300 transition-colors cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                  <Pill className="w-5 h-5 text-teal-800" />
                  <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 text-[10px] font-bold">
                    {rx.status}
                  </span>
                </div>
                <p className="font-bold text-sm text-slate-900">{rx.drugName}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {rx.frequency} • {rx.timing}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-200/60 flex justify-between items-center text-[11px] text-slate-400 font-medium">
                  <span>Refills: {rx.refillsLeft} left</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-800 transition-colors" />
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-200 text-center">
            <button
              onClick={onViewAllPrescriptions}
              className="font-bold text-teal-800 hover:text-teal-900 text-xs transition-colors cursor-pointer"
            >
              View all prescriptions
            </button>
          </div>
        </section>

        {/* Biometric Vitals Tiles */}
        <section className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Blood Pressure */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
              <Heart className="w-6 h-6 fill-rose-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Blood Pressure
              </p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                {biometrics.bloodPressure}{' '}
                <span className="text-xs font-normal text-teal-800 ml-1">
                  {biometrics.bloodPressureStatus}
                </span>
              </p>
            </div>
          </div>

          {/* Current Weight */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 flex items-center gap-4 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-800 shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Current Weight
              </p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                {biometrics.weightLbs} lbs{' '}
                <span className="text-xs font-normal text-slate-500 ml-1">
                  {biometrics.weightChangeLbs} lbs
                </span>
              </p>
            </div>
          </div>

          {/* Avg Daily Steps */}
          <div className="p-5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
                <Footprints className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  Avg. Daily Steps
                </p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">
                  {biometrics.avgDailySteps.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-slate-500">
                    Goal: {biometrics.stepGoal / 1000}k
                  </span>
                </p>
              </div>
            </div>

            {/* Circular Step Ring */}
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle
                  className="text-slate-100"
                  cx="24"
                  cy="24"
                  fill="transparent"
                  r="18"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <circle
                  className="text-teal-700"
                  cx="24"
                  cy="24"
                  fill="transparent"
                  r="18"
                  stroke="currentColor"
                  strokeDasharray="113"
                  strokeDashoffset="18"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-slate-800">84%</span>
            </div>
          </div>
        </section>
      </div>

      {/* Footer subtle text */}
      <footer className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-slate-400 text-xs gap-3">
        <p>© 2024 VitalSync Healthcare Systems. All medical data is encrypted.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-teal-800">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-teal-800">
            Terms of Service
          </a>
          <a href="#" className="hover:text-teal-800">
            Contact Support
          </a>
        </div>
      </footer>
    </div>
  );
};
