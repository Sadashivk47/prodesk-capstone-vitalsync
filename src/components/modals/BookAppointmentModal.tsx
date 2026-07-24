import React, { useState } from 'react';
import { Appointment } from '../../types';
import { X, Calendar, Clock, User } from 'lucide-react';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAppointment: (appointment: Appointment) => void;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  onBookAppointment,
}) => {
  const [doctorName, setDoctorName] = useState('Dr. Sarah Miller');
  const [specialty, setSpecialty] = useState('Cardiology');
  const [reason, setReason] = useState('General Consultation & Checkup');
  const [date, setDate] = useState('Nov 20, 2024');
  const [time, setTime] = useState('10:30 AM');
  const [visitType, setVisitType] = useState('In-Person Visit');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAppointment: Appointment = {
      id: `p-appt-${Date.now()}`,
      patientId: 'pat-202',
      patientName: 'Sarah Johnson',
      patientInitials: 'SJ',
      doctorName,
      specialty,
      visitType,
      date,
      time,
      reason,
      status: 'SCHEDULED',
    };

    onBookAppointment(newAppointment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-900">Book Appointment</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Select Specialist
            </label>
            <select
              value={doctorName}
              onChange={(e) => {
                setDoctorName(e.target.value);
                if (e.target.value.includes('Sarah Miller')) setSpecialty('Cardiology');
                else if (e.target.value.includes('James Wilson')) setSpecialty('Cardiology');
                else setSpecialty('General Medicine');
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-700 font-medium"
            >
              <option value="Dr. Sarah Miller">Dr. Sarah Miller - Lead Cardiologist</option>
              <option value="Dr. James Wilson">Dr. James Wilson - Cardiology Specialist</option>
              <option value="Dr. Elena Rodriguez">Dr. Elena Rodriguez - General Practitioner</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Reason for Visit
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Preferred Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Preferred Time
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-700"
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="04:30 PM">04:30 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Visit Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setVisitType('In-Person Visit')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border ${
                  visitType === 'In-Person Visit'
                    ? 'bg-teal-800 text-white border-teal-800'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                In-Person Visit
              </button>
              <button
                type="button"
                onClick={() => setVisitType('Telehealth Virtual')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border ${
                  visitType === 'Telehealth Virtual'
                    ? 'bg-teal-800 text-white border-teal-800'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Telehealth Virtual
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-800 text-white rounded-lg font-bold text-xs hover:bg-teal-900"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
