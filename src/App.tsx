'use client';

import React, { useState, useEffect } from 'react';
import { User, Role, Appointment, AvailabilitySlot, ClinicalFeedItem, MedicalRecord, Prescription, Biometrics, PaymentItem } from './types';
import { auth } from './lib/auth';
import {
  authApi,
  appointmentsApi,
  availabilityApi,
  clinicalFeedApi,
  medicalRecordsApi,
  prescriptionsApi,
  patientsApi,
  biometricsApi,
  paymentsApi,
} from './lib/api';

import { AuthCard } from './components/auth/AuthCard';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { PatientMobileBottomNav } from './components/layout/PatientMobileBottomNav';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { NewPatientForm } from './components/patient/NewPatientForm';
import { MedicalHistoryDetail } from './components/history/MedicalHistoryDetail';
import { DoctorBilling } from './components/doctor/DoctorBilling';
import { PatientBilling } from './components/patient/PatientBilling';

import { AddRecordModal } from './components/modals/AddRecordModal';
import { BookAppointmentModal } from './components/modals/BookAppointmentModal';
import { AddSlotModal } from './components/modals/AddSlotModal';
import { AiAssistModal } from './components/modals/AiAssistModal';
import { PaymentSuccessModal } from './components/modals/PaymentSuccessModal';

import { Calendar, Pill, ArrowRight, Loader2, CreditCard, Activity } from 'lucide-react';

// ── 3-state auth model ──────────────────────────────────────────────────────
// 'loading'        → auth not yet resolved (show spinner, NEVER login screen)
// 'authenticated'  → user is logged in (show dashboard)
// 'unauthenticated'→ explicitly logged out (show login screen)
type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

function AppLoadingSpinner() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-teal-50/50 gap-4">
      <div className="w-14 h-14 bg-teal-800 rounded-2xl flex items-center justify-center shadow-md shadow-teal-900/10 animate-pulse">
        <Activity className="w-8 h-8 text-teal-300" />
      </div>
      <div className="flex items-center gap-2 text-slate-500">
        <Loader2 className="w-4 h-4 animate-spin text-teal-700" />
        <span className="text-sm font-medium tracking-tight">Loading VitalSync…</span>
      </div>
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pat-emily-chen');
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  // Payments & Stripe state
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [paymentSuccessModalOpen, setPaymentSuccessModalOpen] = useState(false);
  const [confirmedPaymentId, setConfirmedPaymentId] = useState<number | string | undefined>();
  const [isSimulatedPayment, setIsSimulatedPayment] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  // Real Database Collections loaded via API
  const [doctorAppointments, setDoctorAppointments] = useState<Appointment[]>([]);
  const [patientAppointments, setPatientAppointments] = useState<Appointment[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [clinicalFeed, setClinicalFeed] = useState<ClinicalFeedItem[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<Array<{ id: string; name: string; age: number; idCode: string; avatarUrl: string; status: string }>>([]);
  const [biometrics, setBiometrics] = useState<Biometrics>({
    bloodPressure: '118/76',
    bloodPressureStatus: 'Optimal',
    weightLbs: 142,
    weightChangeLbs: -2,
    avgDailySteps: 8420,
    stepGoal: 10000,
  });

  // Modal Open states
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [isBookApptOpen, setIsBookApptOpen] = useState(false);
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [isAiAssistOpen, setIsAiAssistOpen] = useState(false);

  // Hydrate session on mount — resolves authStatus synchronously so the
  // login screen NEVER renders for already-authenticated users.
  useEffect(() => {
    const user = auth.getUser();
    setCurrentUser(user);
    setAuthStatus(user ? 'authenticated' : 'unauthenticated');
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const loadAllData = async () => {
      setIsLoadingData(true);
      try {
        await authApi.getMe();

        const isDoc = currentUser.role === 'doctor';

        if (isDoc) {
          // ── Doctor-only data ──────────────────────────────────────
          const [apptsData, slotsData, feedData, recordsData, rxData, patientsData, paymentsData] =
            await Promise.all([
              appointmentsApi.getAppointments(),
              availabilityApi.getSlots(),
              clinicalFeedApi.getFeed(),
              medicalRecordsApi.getRecords(),
              prescriptionsApi.getPrescriptions(),
              patientsApi.getPatients(),
              paymentsApi.getPayments().catch(() => []),
            ]);

          setDoctorAppointments(apptsData);
          setPatientAppointments(apptsData);
          setAvailabilitySlots(slotsData);
          setClinicalFeed(feedData);
          setMedicalRecords(recordsData);
          setPrescriptions(rxData);
          setPatients(patientsData);
          setPayments(paymentsData || []);
        } else {
          // ── Patient-only data ─────────────────────────────────────
          const [apptsData, recordsData, rxData, bioData, paymentsData] =
            await Promise.all([
              appointmentsApi.getAppointments(),
              medicalRecordsApi.getRecords(),
              prescriptionsApi.getPrescriptions(),
              biometricsApi.getBiometrics(),
              paymentsApi.getPayments().catch(() => []),
            ]);

          setPatientAppointments(apptsData);
          setDoctorAppointments(apptsData);
          setMedicalRecords(recordsData);
          setPrescriptions(rxData);
          setBiometrics(bioData);
          setPayments(paymentsData || []);
        }
      } catch (err) {
        console.error('Failed loading backend data:', err);
        if (err instanceof Error && err.message.includes('401')) {
          auth.logout();
          setCurrentUser(null);
        }
      } finally {
        setIsLoadingData(false);
      }
    };

    loadAllData();

    // Check URL parameters for Stripe checkout redirect callback
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const sessionId = urlParams.get('session_id');
    const paymentId = urlParams.get('payment_id');
    const simulated = urlParams.get('simulated');

    if (paymentStatus === 'success' && sessionId && paymentId) {
      paymentsApi.confirmPayment(paymentId, sessionId)
        .then(() => {
          setConfirmedPaymentId(paymentId);
          setIsSimulatedPayment(simulated === 'true');
          setPaymentSuccessModalOpen(true);
          // Refresh payments list
          paymentsApi.getPayments().then(setPayments).catch(() => {});
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch((err) => {
          console.error('Error confirming payment:', err);
        });
    } else if (paymentStatus === 'cancelled') {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [currentUser]);

  const handlePayNow = async (payment: PaymentItem) => {
    setIsPaymentLoading(true);
    try {
      const res = await paymentsApi.createCheckoutSession({
        type: payment.type,
        amount: Number(payment.amount),
        description: payment.description,
        referenceId: Number(payment.id),
        dueDate: payment.dueDate,
      });
      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(`Payment initialization failed: ${err?.response?.data?.message || err?.message || 'Server error'}`);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleCustomPay = async (
    amount: number,
    description: string,
    type: 'consultation' | 'prescription' | 'general'
  ) => {
    setIsPaymentLoading(true);
    try {
      const res = await paymentsApi.createCheckoutSession({
        type,
        amount,
        description,
      });
      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(`Payment initialization failed: ${err?.response?.data?.message || err?.message || 'Server error'}`);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handlePayAndBookAppointment = async (newAppt: Appointment) => {
    await handleBookAppointment(newAppt);
    handleCustomPay(80, `Consultation Fee — ${newAppt.doctorName} (${newAppt.date})`, 'consultation');
  };

  const handleLogout = () => {
    auth.clearToken();
    setCurrentUser(null);
    setAuthStatus('unauthenticated'); // explicit state prevents re-flash on logout
  };

  const handleSwitchRole = (role: Role) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      role,
    });
    setActiveTab('dashboard');
  };

  const handleAddMedicalRecord = async (newRecordData: MedicalRecord) => {
    try {
      const created = await medicalRecordsApi.createRecord(newRecordData);
      setMedicalRecords((prev) => [created, ...prev]);
    } catch (err) {
      setMedicalRecords((prev) => [newRecordData, ...prev]);
    }
  };

  const handleBookAppointment = async (newApptData: Appointment) => {
    try {
      const created = await appointmentsApi.createAppointment(newApptData);
      setPatientAppointments((prev) => [created, ...prev]);
      setDoctorAppointments((prev) => [created, ...prev]);
    } catch (err) {
      setPatientAppointments((prev) => [newApptData, ...prev]);
      setDoctorAppointments((prev) => [newApptData, ...prev]);
    }
  };

  const handleCancelPatientAppointment = async (id: string) => {
    try {
      await appointmentsApi.updateStatus(id, 'CANCELLED');
      setPatientAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'CANCELLED' } : a)));
      setDoctorAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'CANCELLED' } : a)));
    } catch (err) {
      setPatientAppointments((prev) => prev.filter((a) => a.id !== id));
      setDoctorAppointments((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleAddSlot = async (slot: AvailabilitySlot) => {
    try {
      const created = await availabilityApi.createSlot(slot.timeRange, slot.date);
      setAvailabilitySlots((prev) => [...prev, created]);
    } catch (err) {
      setAvailabilitySlots((prev) => [...prev, slot]);
    }
  };

  const handleDeleteSlot = async (id: string) => {
    try {
      await availabilityApi.deleteSlot(id);
      setAvailabilitySlots((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setAvailabilitySlots((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleViewPatientRecord = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('history');
  };

  // ── Auth gate (3-state) ───────────────────────────────────────────────────
  if (authStatus === 'loading') {
    // Auth not yet resolved — show neutral spinner, never the login screen
    return <AppLoadingSpinner />;
  }
  if (authStatus === 'unauthenticated' || !currentUser) {
    // Explicitly logged out — safe to show login
    return (
      <AuthCard
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setAuthStatus('authenticated');
        }}
      />
    );
  }
  // authStatus === 'authenticated' → fall through to dashboard

  const isDoctor = currentUser.role === 'doctor';
  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0] || {
    id: 'pat-emily-chen',
    name: 'Emily Chen',
    age: 28,
    idCode: '#VC-9821-EC',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    status: 'ACTIVE FILE',
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        user={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[280px] min-h-screen flex flex-col">
        {/* Top Header */}
        <Topbar
          user={currentUser}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Global Loading Bar */}
        {isLoadingData && (
          <div className="bg-teal-50 border-b border-teal-200 px-4 py-1.5 text-xs text-teal-800 font-medium flex items-center justify-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-700" />
            <span>Synchronizing live clinical database...</span>
          </div>
        )}

        {/* View Switcher Routing */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            isDoctor ? (
              <DoctorDashboard
                user={currentUser}
                appointments={doctorAppointments}
                availabilitySlots={availabilitySlots}
                clinicalFeed={clinicalFeed}
                onViewPatientRecord={handleViewPatientRecord}
                onOpenAddSlot={() => setIsAddSlotOpen(true)}
                onDeleteSlot={handleDeleteSlot}
                onOpenNewPatientModal={() => setActiveTab('new-patient')}
                onOpenAiAssist={() => setIsAiAssistOpen(true)}
                searchQuery={searchQuery}
              />
            ) : (
              <PatientDashboard
                upcomingAppointments={patientAppointments}
                prescriptions={prescriptions.filter((r) => r.patientName === currentUser.name || r.patientName === 'Sarah Johnson')}
                biometrics={biometrics}
                onOpenBookAppointment={() => setIsBookApptOpen(true)}
                onCancelAppointment={handleCancelPatientAppointment}
                onViewAllPrescriptions={() => setActiveTab('prescriptions')}
                onOpenAiAssist={() => setIsAiAssistOpen(true)}
              />
            )
          )}

          {activeTab === 'history' && (
            <MedicalHistoryDetail
              records={medicalRecords}
              patientName={selectedPatient.name}
              patientAge={selectedPatient.age}
              patientIdCode={selectedPatient.idCode}
              patientAvatarUrl={selectedPatient.avatarUrl}
              onOpenAddRecord={() => setIsAddRecordOpen(true)}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'patients' && (
            <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-2xl text-slate-900">Patient Directory</h3>
                <button
                  onClick={() => setIsAddRecordOpen(true)}
                  className="bg-teal-800 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-teal-900 cursor-pointer"
                >
                  + Add Medical Note
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {patients.map((pat) => (
                  <div
                    key={pat.id}
                    onClick={() => handleViewPatientRecord(pat.id)}
                    className="bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-700 transition-all cursor-pointer shadow-xs space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={pat.avatarUrl}
                        alt={pat.name}
                        className="w-12 h-12 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{pat.name}</h4>
                        <p className="text-xs text-slate-500">{pat.idCode}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                      <span className="text-slate-500">{pat.age} Yrs Old</span>
                      <span className="font-bold text-teal-800 flex items-center gap-1">
                        View Records <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-2xl text-slate-900">Appointments Schedule</h3>
                <button
                  onClick={() => setIsBookApptOpen(true)}
                  className="bg-teal-800 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-teal-900 cursor-pointer"
                >
                  + Book Appointment
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="divide-y divide-slate-100">
                  {(isDoctor ? doctorAppointments : patientAppointments).map((appt) => (
                    <div key={appt.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900">
                            {isDoctor ? appt.patientName : appt.doctorName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {appt.specialty} • {appt.reason || appt.visitType}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-left sm:text-right text-xs">
                          <p className="font-mono font-bold text-slate-900">{appt.date}</p>
                          <p className="text-slate-500">{appt.time}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-teal-100 text-teal-900">
                          {appt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
              <h3 className="font-bold text-2xl text-slate-900">Active Prescriptions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prescriptions.map((rx) => (
                  <div key={rx.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Pill className="w-5 h-5 text-teal-800" />
                          <h4 className="font-bold text-base text-slate-900">{rx.drugName}</h4>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 text-[10px] font-bold">
                          {rx.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">Patient: <strong>{rx.patientName}</strong></p>
                      <p className="text-xs text-slate-500">{rx.dosage} • {rx.frequency} ({rx.timing})</p>
                      {rx.instructions && (
                        <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 mt-2">
                          "{rx.instructions}"
                        </p>
                      )}
                    </div>
                    {!isDoctor && (
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-3">
                        <span className="text-xs font-bold text-slate-700">Refill Price: $45.00</span>
                        <button
                          onClick={() => handleCustomPay(45, `Prescription Refill: ${rx.drugName} (${rx.dosage})`, 'prescription')}
                          className="px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-lg font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-teal-300" />
                          <span>Order & Pay ($45)</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="p-4 md:p-8 max-w-6xl mx-auto">
              {isDoctor ? (
                <DoctorBilling
                  payments={payments}
                  onPayNow={handlePayNow}
                  isLoading={isPaymentLoading}
                />
              ) : (
                <PatientBilling
                  payments={payments}
                  onPayNow={handlePayNow}
                  onCustomPay={handleCustomPay}
                  isLoading={isPaymentLoading}
                />
              )}
            </div>
          )}

          {activeTab === 'availability' && (
            <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-2xl text-slate-900">Manage Doctor Availability</h3>
                <button
                  onClick={() => setIsAddSlotOpen(true)}
                  className="bg-teal-800 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-teal-900 cursor-pointer"
                >
                  + Add Slot
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
                {availabilitySlots.map((slot) => (
                  <div key={slot.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                    <span className="font-mono text-sm font-bold text-slate-800">{slot.timeRange}</span>
                    <button
                      onClick={() => handleDeleteSlot(slot.id)}
                      className="text-rose-600 text-xs font-bold hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'book' && (
            <div className="p-4 md:p-8 max-w-xl mx-auto space-y-6">
              <h3 className="font-bold text-2xl text-slate-900">Book Appointment</h3>
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                <p className="text-sm text-slate-600 mb-4">
                  Schedule an in-person clinic visit or a telehealth video consultation with VitalSync specialists.
                </p>
                <button
                  onClick={() => setIsBookApptOpen(true)}
                  className="w-full py-3 bg-teal-800 text-white rounded-lg font-bold text-sm hover:bg-teal-900 cursor-pointer"
                >
                  Open Booking Wizard
                </button>
              </div>
            </div>
          )}

          {activeTab === 'new-patient' && (
            <NewPatientForm
              onSuccess={async () => {
                try {
                  const updatedPatients = await patientsApi.getPatients();
                  setPatients(updatedPatients);
                } catch (err) {
                  console.error('Failed refreshing patients:', err);
                }
                setActiveTab('patients');
              }}
            />
          )}
        </div>

        {/* Mobile Bottom Navigation for Patient */}
        {!isDoctor && (
          <PatientMobileBottomNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Dialog Modals */}
      <AddRecordModal
        isOpen={isAddRecordOpen}
        onClose={() => setIsAddRecordOpen(false)}
        onAddRecord={handleAddMedicalRecord}
        patientName={selectedPatient.name}
        patientAge={selectedPatient.age}
      />

      <BookAppointmentModal
        isOpen={isBookApptOpen}
        onClose={() => setIsBookApptOpen(false)}
        onBookAppointment={handleBookAppointment}
        onPayAndBook={handlePayAndBookAppointment}
      />

      <AddSlotModal
        isOpen={isAddSlotOpen}
        onClose={() => setIsAddSlotOpen(false)}
        onAddSlot={handleAddSlot}
      />

      <AiAssistModal
        isOpen={isAiAssistOpen}
        onClose={() => setIsAiAssistOpen(false)}
        user={currentUser}
        medicalRecords={medicalRecords}
      />

      <PaymentSuccessModal
        isOpen={paymentSuccessModalOpen}
        onClose={() => setPaymentSuccessModalOpen(false)}
        paymentId={confirmedPaymentId}
        isSimulated={isSimulatedPayment}
      />
    </div>
  );
}
