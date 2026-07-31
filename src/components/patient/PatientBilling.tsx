import React, { useState } from 'react';
import { PaymentItem } from '../../types';
import { CreditCard, CheckCircle2, Clock, PlusCircle, AlertCircle, ShieldCheck, Receipt, DollarSign } from 'lucide-react';

interface PatientBillingProps {
  payments: PaymentItem[];
  onPayNow: (payment: PaymentItem) => Promise<void>;
  onCustomPay: (amount: number, description: string, type: 'consultation' | 'prescription' | 'general') => Promise<void>;
  isLoading?: boolean;
}

export const PatientBilling: React.FC<PatientBillingProps> = ({
  payments,
  onPayNow,
  onCustomPay,
  isLoading = false,
}) => {
  const [processingId, setProcessingId] = useState<number | string | null>(null);
  const [showPayFeeModal, setShowPayFeeModal] = useState(false);
  const [customAmount, setCustomAmount] = useState('50');
  const [customDescription, setCustomDescription] = useState('General Consultation & Co-pay Fee');
  const [customType, setCustomType] = useState<'consultation' | 'prescription' | 'general'>('general');
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);

  const pendingPayments = payments.filter((p) => p.status === 'pending');
  const paidPayments = payments.filter((p) => p.status === 'paid');

  const totalPaid = paidPayments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPending = pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0);

  const handlePayClick = async (payment: PaymentItem) => {
    setProcessingId(payment.id);
    try {
      await onPayNow(payment);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCustomPaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customAmount);
    if (isNaN(val) || val <= 0) return;

    setIsSubmittingCustom(true);
    try {
      await onCustomPay(val, customDescription || 'General Healthcare Fee', customType);
      setShowPayFeeModal(false);
    } finally {
      setIsSubmittingCustom(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-teal-300 font-semibold text-xs tracking-wider uppercase mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Patient Financial Account</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Billing & Payment Statements</h1>
          <p className="text-teal-100 text-sm mt-1 max-w-xl">
            Pay consultation fees, active prescription orders, and medical co-pays easily through Stripe Checkout.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPayFeeModal(true)}
            className="px-5 py-3 bg-teal-400 hover:bg-teal-300 active:bg-teal-500 text-teal-950 font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Pay Custom Fee</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Balance</p>
            <p className="text-2xl font-bold text-amber-600">${totalPending.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Paid</p>
            <p className="text-2xl font-bold text-emerald-600">${totalPaid.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Transactions</p>
            <p className="text-2xl font-bold text-slate-900">{payments.length} Receipts</p>
          </div>
        </div>
      </div>

      {/* Payments History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-teal-700" />
            Payment History & Invoices
          </h2>
          <span className="text-xs font-medium text-slate-500">
            {payments.length} Records
          </span>
        </div>

        {payments.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <AlertCircle className="w-10 h-10 mx-auto text-slate-400 mb-3" />
            <p className="font-semibold text-slate-700">No payment history found.</p>
            <p className="text-xs text-slate-500 mt-1">Use the "Pay Custom Fee" button above to initiate a payment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Description</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6">Amount</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {payments.map((p) => {
                  const isPending = p.status === 'pending';
                  const isBusy = processingId === p.id || isLoading;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-900">
                        <div className="flex flex-col">
                          <span>{p.description}</span>
                          <span className="text-[11px] text-slate-400 font-mono mt-0.5">
                            INV #{p.id} {p.createdAt ? `• ${new Date(p.createdAt).toLocaleDateString()}` : ''}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="capitalize text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                          {p.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900 text-base">
                        ${Number(p.amount).toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3.5 h-3.5" />
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Paid
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {isPending ? (
                          <button
                            onClick={() => handlePayClick(p)}
                            disabled={isBusy}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white font-bold text-xs rounded-lg transition-all shadow-sm cursor-pointer disabled:opacity-50"
                          >
                            {processingId === p.id ? (
                              <>
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Redirecting...</span>
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-4 h-4 text-teal-300" />
                                <span>Pay Now</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-600 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Paid
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pay Custom Fee Modal */}
      {showPayFeeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-teal-700" />
                Make Quick Payment
              </h3>
              <button
                onClick={() => setShowPayFeeModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCustomPaySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Payment Context / Type
                </label>
                <select
                  value={customType}
                  onChange={(e: any) => setCustomType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-700"
                >
                  <option value="general">General Fee / Medical Co-pay</option>
                  <option value="consultation">Virtual Consultation Fee</option>
                  <option value="prescription">Prescription Refill Order</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Amount ($ USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    required
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Description / Note
                </label>
                <input
                  type="text"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  required
                  placeholder="e.g. Telehealth Follow-up Fee"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPayFeeModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCustom}
                  className="px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingCustom ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-teal-300" />
                      <span>Proceed to Stripe Checkout</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
