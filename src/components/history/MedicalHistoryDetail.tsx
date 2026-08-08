import React, { useState } from 'react';
import { MedicalRecord } from '../../types';
import { exportToCSV, exportToPDF } from '../../lib/exportUtils';
import {
  FileText,
  Download,
  Plus,
  Cake,
  Fingerprint,
  ChevronDown,
  ChevronUp,
  Pill,
  Search,
  Bot,
  Sparkles,
} from 'lucide-react';

interface MedicalHistoryDetailProps {
  records: MedicalRecord[];
  patientName?: string;
  patientAge?: number;
  patientIdCode?: string;
  patientAvatarUrl?: string;
  onOpenAddRecord: () => void;
  /** Phase 2 — Opens the AI Clinical Summary modal */
  onOpenAiAssist?: () => void;
  searchQuery?: string;
}

export const MedicalHistoryDetail: React.FC<MedicalHistoryDetailProps> = ({
  records,
  patientName = 'Emily Chen',
  patientAge = 28,
  patientIdCode = '#VC-9821-EC',
  patientAvatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  onOpenAddRecord,
  onOpenAiAssist,
  searchQuery = '',
}) => {
  const [expandedRecordIds, setExpandedRecordIds] = useState<Record<string, boolean>>({
    'rec-101': true,
  });

  const toggleExpand = (id: string) => {
    setExpandedRecordIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredRecords = records.filter(
    (rec) =>
      rec.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.symptoms.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.clinicalNotes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.attendingPhysician.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadCSV = () => {
    exportToCSV(records, patientName);
  };

  const handleDownloadPDF = () => {
    exportToPDF(records, patientName, { age: patientAge, idCode: patientIdCode });
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 pb-28 md:pb-8">
      {/* Patient Profile Header Card */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-teal-200 overflow-hidden shrink-0">
            <img
              src={patientAvatarUrl}
              alt={patientName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{patientName}</h1>
              <span className="px-2.5 py-0.5 bg-teal-100 text-teal-900 rounded-full text-[10px] font-bold uppercase tracking-wider">
                ACTIVE FILE
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <Cake className="w-3.5 h-3.5 text-slate-400" /> {patientAge} Years Old
              </span>
              <span className="flex items-center gap-1">
                <Fingerprint className="w-3.5 h-3.5 text-slate-400" /> ID: {patientIdCode}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Phase 2 — Generate AI Summary button (doctor-only feature) */}
          {onOpenAiAssist && (
            <button
              onClick={onOpenAiAssist}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-teal-800 text-white rounded-lg font-bold text-xs hover:bg-teal-900 transition-colors cursor-pointer shadow-sm"
              title="Generate an AI-powered clinical summary for this patient"
            >
              <Sparkles className="w-4 h-4" />
              Generate AI Summary
            </button>
          )}
          <button
            onClick={handleDownloadPDF}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-teal-800 text-teal-800 rounded-lg font-bold text-xs hover:bg-teal-50 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={handleDownloadCSV}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-teal-800 text-teal-800 rounded-lg font-bold text-xs hover:bg-teal-50 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download as CSV
          </button>
        </div>
      </section>

      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl text-slate-900">Medical History</h3>
        <button
          onClick={onOpenAddRecord}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-800 text-white rounded-lg font-bold text-xs md:text-sm hover:bg-teal-900 transition-all active:scale-[0.98] shadow-sm shadow-teal-900/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add new record
        </button>
      </div>

      {/* Timeline View */}
      <div className="relative pl-6 md:pl-8 space-y-6 before:absolute before:left-3 md:before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
        {filteredRecords.map((record) => {
          const isExpanded = !!expandedRecordIds[record.id];
          return (
            <div key={record.id} className="relative pb-2">
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-6 md:-left-8 top-4 w-5 h-5 rounded-full bg-teal-800 border-4 border-white ring-2 ring-teal-100 z-10"></div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                {/* Record Header Strip */}
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    {record.date}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      record.encounterType === 'CLINIC VISIT'
                        ? 'bg-teal-800 text-white'
                        : record.encounterType === 'TELEHEALTH'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {record.encounterType}
                  </span>
                </div>

                {/* Record Body Content */}
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                    <h4 className="font-bold text-xl text-teal-900">{record.diagnosis}</h4>
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Attending Physician
                      </p>
                      <p className="font-bold text-sm text-slate-900">
                        {record.attendingPhysician}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Symptoms
                        </p>
                        <p className="text-sm text-slate-800">{record.symptoms}</p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Clinical Notes
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed italic">
                          {isExpanded
                            ? record.clinicalNotes
                            : `${record.clinicalNotes.slice(0, 90)}...`}
                          <button
                            onClick={() => toggleExpand(record.id)}
                            className="text-teal-800 font-bold ml-1.5 hover:underline inline-flex items-center text-xs cursor-pointer not-italic"
                          >
                            {isExpanded ? 'Show less' : 'Read more'}
                          </button>
                        </p>
                      </div>
                    </div>

                    {/* Prescriptions Sub-block */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200/80">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Pill className="w-3.5 h-3.5 text-teal-800" />
                        Prescriptions
                      </p>
                      {record.prescriptions && record.prescriptions.length > 0 ? (
                        <div className="space-y-2">
                          {record.prescriptions.map((rx, idx) => (
                            <div key={idx} className="flex items-start gap-2.5">
                              <div className="w-2 h-2 rounded-full bg-teal-700 mt-1.5 shrink-0"></div>
                              <div>
                                <p className="font-bold text-xs text-slate-900">{rx.name}</p>
                                <p className="text-xs text-slate-500">{rx.dosage}</p>
                                {rx.duration && (
                                  <span className="text-[10px] text-teal-900 bg-teal-100 px-2 py-0.5 rounded mt-1 inline-block font-semibold">
                                    Duration: {rx.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">No active prescription issued.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load Older Records Pagination button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => alert('Older archived records retrieved from cloud vault.')}
          className="text-teal-800 font-bold text-sm flex items-center gap-1.5 px-4 py-2 hover:bg-teal-50 rounded-lg transition-all cursor-pointer"
        >
          Load older records
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
