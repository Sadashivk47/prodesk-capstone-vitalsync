import React, { useState } from 'react';
import { PaymentItem } from '../../types';
import { CreditCard, CheckCircle2, Clock, AlertCircle, ExternalLink, ShieldCheck, DollarSign } from 'lucide-react';

interface DoctorBillingProps {
  payments: PaymentItem[];
  onPayNow: (payment: PaymentItem) => Promise<void>;
  isLoading?: boolean;
}

export const DoctorBilling: React.FC<DoctorBillingProps> = ({
  payments,
  onPayNow,
  isLoading = false,
}) => {
  const [processingId, setProcessingId] = useState<number | string | null>(null);

  const dues = payments.filter((p) => p.type === 'due');
  const pendingDues = dues.filter((p) => p.status === 'pending');
  const paidDues = dues.filter((p) => p.status === 'paid');

  const totalPendingAmount = pendingDues.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPaidAmount = paidDues.reduce((sum, p) => sum + Number(p.amount), 0);

  const handlePayClick = async (payment: PaymentItem) => {
    setProcessingId(payment.id);
    try {
      await onPayNow(payment);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-teal-300 font-semibold text-xs tracking-wider uppercase mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Doctor Financial Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Clinic Dues & Malpractice Billings</h1>
          <p className="text-teal-100 text-sm mt-1 max-w-xl">
            Manage your clinic facility maintenance fees, annual licensing, and platform dues securely via Stripe Checkout.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/15 self-stretch md:self-auto justify-around">
          <div className="text-center px-2">
            <p className="text-[11px] text-teal-200 uppercase tracking-wider">Pending Dues</p>
            <p className="text-xl font-bold text-amber-300">${totalPendingAmount.toFixed(2)}</p>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div className="text-center px-2">
            <p className="text-[11px] text-teal-200 uppercase tracking-wider">Paid to Date</p>
            <p className="text-xl font-bold text-emerald-300">${totalPaidAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Outstanding Dues</p>
            <p className="text-2xl font-bold text-slate-900">{pendingDues.length} Items</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Settled Accounts</p>
            <p className="text-2xl font-bold text-slate-900">{paidDues.length} Paid</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment Processor</p>
            <p className="text-sm font-bold text-teal-800">Stripe Test Mode</p>
          </div>
        </div>
      </div>

      {/* Dues Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-teal-700" />
            Clinic Charges & Subscriptions
          </h2>
          <span className="text-xs font-medium text-slate-500">
            Total Records: {dues.length}
          </span>
        </div>

        {dues.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <AlertCircle className="w-10 h-10 mx-auto text-slate-400 mb-3" />
            <p className="font-semibold text-slate-700">No outstanding or past dues found.</p>
            <p className="text-xs text-slate-500 mt-1">All your physician dues and charges are up to date.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Description</th>
                  <th className="py-3.5 px-6">Due Date</th>
                  <th className="py-3.5 px-6">Amount</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {dues.map((due) => {
                  const isPending = due.status === 'pending';
                  const isBusy = processingId === due.id || isLoading;

                  return (
                    <tr key={due.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-900">
                        <div className="flex flex-col">
                          <span>{due.description}</span>
                          <span className="text-[11px] text-slate-400 font-mono mt-0.5">
                            REF #{due.id} • {due.type.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {due.dueDate ? new Date(due.dueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900 text-base">
                        ${Number(due.amount).toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3.5 h-3.5" />
                            Pending Payment
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
                            onClick={() => handlePayClick(due)}
                            disabled={isBusy}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-800 hover:bg-teal-900 active:bg-teal-950 text-white font-bold text-xs rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50 cursor-pointer"
                          >
                            {processingId === due.id ? (
                              <>
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Redirecting...</span>
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-4 h-4 text-teal-300" />
                                <span>Pay Now</span>
                                <ExternalLink className="w-3 h-3 text-teal-300" />
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-600 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Settled
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
    </div>
  );
};
