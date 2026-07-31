import React from 'react';
import { CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId?: string | number;
  isSimulated?: boolean;
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  isOpen,
  onClose,
  paymentId,
  isSimulated = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-200">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-teal-800 uppercase tracking-widest mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Payment Verified</span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Transaction Successful!
        </h2>

        <p className="text-sm text-slate-600 mb-6">
          Thank you. Your payment {paymentId ? `(REF #${paymentId})` : ''} has been confirmed and logged in your VitalSync account ledger.
        </p>

        {isSimulated && (
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium">
            💡 <strong>Stripe Test Mode Flow</strong>: Completed test payment checkout redirect.
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
