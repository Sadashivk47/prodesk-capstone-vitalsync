import React, { useState } from 'react';
import { MedicalRecord, PrescriptionEntry } from '../../types';
import { X, Plus, Trash2 } from 'lucide-react';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecord: (record: MedicalRecord) => void;
  patientName?: string;
  patientAge?: number;
}

export const AddRecordModal: React.FC<AddRecordModalProps> = ({
  isOpen,
  onClose,
  onAddRecord,
  patientName = 'Emily Chen',
  patientAge = 28,
}) => {
  const [date, setDate] = useState('OCT 24, 2024');
  const [encounterType, setEncounterType] = useState<'CLINIC VISIT' | 'TELEHEALTH' | 'LAB RESULTS'>('CLINIC VISIT');
  const [attendingPhysician, setAttendingPhysician] = useState('Dr. Sarah Miller');
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [rxName, setRxName] = useState('');
  const [rxDosage, setRxDosage] = useState('');
  const [rxDuration, setRxDuration] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis || !symptoms) return;

    const prescriptions: PrescriptionEntry[] = [];
    if (rxName) {
      prescriptions.push({
        name: rxName,
        dosage: rxDosage || 'As directed',
        duration: rxDuration || undefined,
      });
    }

    const newRecord: MedicalRecord = {
      id: `rec-${Date.now()}`,
      patientId: 'pat-emily-chen',
      patientName,
      patientAge,
      date: date.toUpperCase(),
      encounterType,
      attendingPhysician,
      diagnosis,
      symptoms,
      clinicalNotes: clinicalNotes || 'Patient examined. Progressing normally under clinical observation.',
      prescriptions,
    };

    onAddRecord(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-900">Add New Medical Record</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Date
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
                Visit Type
              </label>
              <select
                value={encounterType}
                onChange={(e) => setEncounterType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-700"
              >
                <option value="CLINIC VISIT">CLINIC VISIT</option>
                <option value="TELEHEALTH">TELEHEALTH</option>
                <option value="LAB RESULTS">LAB RESULTS</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Attending Physician
            </label>
            <input
              type="text"
              value={attendingPhysician}
              onChange={(e) => setAttendingPhysician(e.target.value)}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Diagnosis
            </label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Acute Sinusitis or Hypertension Follow-up"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Symptoms
            </label>
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Headache, low-grade fever, nasal congestion"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Clinical Notes
            </label>
            <textarea
              rows={3}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="Enter detailed physician observation notes..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          {/* Prescription section */}
          <div className="border-t border-slate-200 pt-3 space-y-2">
            <p className="font-bold text-xs text-slate-700 uppercase tracking-wider">
              Issued Prescription (Optional)
            </p>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Drug Name (e.g. Amoxicillin)"
                value={rxName}
                onChange={(e) => setRxName(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
              <input
                type="text"
                placeholder="Dosage (1 tab 2x/day)"
                value={rxDosage}
                onChange={(e) => setRxDosage(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
              <input
                type="text"
                placeholder="Duration (7 days)"
                value={rxDuration}
                onChange={(e) => setRxDuration(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
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
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
