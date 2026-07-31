import React, { useState } from 'react';
import { patientsApi } from '../../lib/api';
import { UserPlus, CheckCircle, AlertCircle } from 'lucide-react';

interface NewPatientFormProps {
  onSuccess?: () => void;
}

type FormState = 'idle' | 'loading' | 'success' | 'error';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const NewPatientForm: React.FC<NewPatientFormProps> = ({ onSuccess }) => {
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successName, setSuccessName] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [medicalRecordNumber, setMedicalRecordNumber] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setFormState('loading');

    try {
      const result = await patientsApi.createPatient({
        firstName,
        lastName,
        email,
        dateOfBirth: dateOfBirth || undefined,
        bloodGroup: bloodGroup || undefined,
        medicalRecordNumber: medicalRecordNumber || undefined,
        emergencyContactName: emergencyContactName || undefined,
        emergencyContactPhone: emergencyContactPhone || undefined,
      });

      setSuccessName(result.name || `${firstName} ${lastName}`);
      setFormState('success');
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Failed to create patient.';
      setErrorMessage(msg);
      setFormState('error');
    }
  };

  const handleReset = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setDateOfBirth('');
    setBloodGroup('');
    setMedicalRecordNumber('');
    setEmergencyContactName('');
    setEmergencyContactPhone('');
    setErrorMessage('');
    setFormState('idle');
    setSuccessName('');
  };

  if (formState === 'success') {
    return (
      <div className="p-4 md:p-8 max-w-xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
            <CheckCircle className="w-9 h-9 text-emerald-600" />
          </div>
          <h3 className="font-bold text-xl text-slate-900">Patient Created</h3>
          <p className="text-slate-500 text-sm">
            <strong>{successName}</strong> has been added to the patient directory.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Add Another
            </button>
            {onSuccess && (
              <button
                onClick={onSuccess}
                className="px-5 py-2.5 bg-teal-800 text-white rounded-lg text-sm font-bold hover:bg-teal-900 transition-colors cursor-pointer"
              >
                View Directory
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-teal-50 text-teal-800 rounded-xl flex items-center justify-center">
          <UserPlus className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-2xl text-slate-900">New Patient Entry</h3>
          <p className="text-sm text-slate-500">Register a new patient record in the system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Row */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h4 className="font-bold text-sm text-slate-700 uppercase tracking-wider">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="new-patient-first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Emily"
                required
                className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:ring-2 focus:ring-teal-700 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="new-patient-last-name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Chen"
                required
                className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:ring-2 focus:ring-teal-700 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              id="new-patient-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="patient@email.com"
              required
              className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:ring-2 focus:ring-teal-700 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Date of Birth
              </label>
              <input
                id="new-patient-dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:ring-2 focus:ring-teal-700 focus:bg-white focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Blood Group
              </label>
              <select
                id="new-patient-blood-group"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:ring-2 focus:ring-teal-700 focus:bg-white focus:outline-none transition-all"
              >
                <option value="">— Select —</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Medical Record Number
            </label>
            <input
              id="new-patient-mrn"
              type="text"
              value={medicalRecordNumber}
              onChange={(e) => setMedicalRecordNumber(e.target.value)}
              placeholder="e.g. MRN-001234 (auto-generated if blank)"
              className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:ring-2 focus:ring-teal-700 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <h4 className="font-bold text-sm text-slate-700 uppercase tracking-wider">
            Emergency Contact
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Contact Name
              </label>
              <input
                id="new-patient-ec-name"
                type="text"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                placeholder="e.g. John Chen"
                className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:ring-2 focus:ring-teal-700 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Contact Phone
              </label>
              <input
                id="new-patient-ec-phone"
                type="tel"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                placeholder="e.g. +1 555-000-1234"
                className="w-full h-12 px-4 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:ring-2 focus:ring-teal-700 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {formState === 'error' && errorMessage && (
          <div className="flex items-start gap-2.5 text-xs text-rose-700 bg-rose-50 p-3 rounded-lg border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={formState === 'loading'}
            className="px-6 py-2.5 bg-teal-800 text-white rounded-lg text-sm font-bold hover:bg-teal-900 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-teal-900/10 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-4 h-4" />
            {formState === 'loading' ? 'Creating…' : 'Create Patient'}
          </button>
        </div>
      </form>
    </div>
  );
};
