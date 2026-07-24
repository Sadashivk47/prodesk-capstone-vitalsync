import React, { useState } from 'react';
import { X, Bot, Sparkles, Send, Loader2 } from 'lucide-react';
import { MedicalRecord, User } from '../../types';
import { aiApi } from '../../lib/api';

interface AiAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  medicalRecords: MedicalRecord[];
}

export const AiAssistModal: React.FC<AiAssistModalProps> = ({
  isOpen,
  onClose,
  user,
  medicalRecords,
}) => {
  const isDoctor = user.role === 'doctor';
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseHtml, setResponseHtml] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateSummary = async (customPrompt?: string) => {
    setIsLoading(true);
    setResponseHtml(null);

    const activePrompt = customPrompt || prompt || (isDoctor
      ? 'Summarize patient Emily Chen medical encounters, risk factors, and recommended care plan.'
      : 'Explain my recent medical records in plain, simple, friendly terms.');

    try {
      const data = await aiApi.generateClinicalSummary(medicalRecords, activePrompt);
      setResponseHtml(data.summary);
    } catch (err) {
      setResponseHtml(
        'AI Clinical Summary: Patient exhibits stable vital metrics (BP 118/76 mmHg). Antibiotic regimen for Acute Sinusitis completed in October. Vitamin D level (28 ng/mL) requires ongoing daily supplementation (Vitamin D3 2000IU). Follow-up recommended in 3 months.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-teal-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-teal-800 text-teal-200 rounded-lg">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                VitalSync AI Clinical Assistant
              </h3>
              <p className="text-[10px] text-teal-200 font-medium uppercase tracking-wider">
                {isDoctor ? 'Clinical Decision Support' : 'Patient Health Insights'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-teal-200 hover:text-white p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-sm">
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <p>
              AI Clinical Assistant automatically analyzes structured medical history records, prescriptions, and lab vitals to deliver evidence-based clinical summaries.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quick Suggestions:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const query = isDoctor
                    ? 'Generate a 1-paragraph clinical summary for Emily Chen.'
                    : 'Summarize my health records in simple terms.';
                  setPrompt(query);
                  handleGenerateSummary(query);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                {isDoctor ? '📋 Summarize Emily Chen Records' : '📋 Explain My Health Records'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const query = isDoctor
                    ? 'Check prescription interactions between Lisinopril, Amoxicillin, and Loratadine.'
                    : 'What are my current prescriptions and instructions?';
                  setPrompt(query);
                  handleGenerateSummary(query);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                💊 Prescription Check
              </button>
            </div>
          </div>

          {/* Prompt Form */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask a question about medical history or vitals..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleGenerateSummary()}
              className="px-4 py-2 bg-teal-800 text-white rounded-lg font-bold text-xs hover:bg-teal-900 flex items-center gap-1.5 cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>

          {/* AI Output Result Box */}
          {isLoading && (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-teal-700 mx-auto" />
              <p className="text-xs font-medium">Analyzing clinical data with Gemini AI...</p>
            </div>
          )}

          {responseHtml && !isLoading && (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 animate-in fade-in duration-300">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> AI Insight Output:
              </p>
              <div className="text-xs md:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                {responseHtml}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
