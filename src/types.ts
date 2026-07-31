export type Role = 'doctor' | 'patient';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  title?: string;
  specialty?: string;
  avatarUrl?: string;
  memberSince?: string;
}

export interface DoctorProfile {
  id?: string;
  userId: string;
  specialty: string;
  yearsExperience: number;
  licenseNumber: string;
  bio: string;
}

export interface PatientProfile {
  id?: string;
  userId: string;
  medicalRecordNumber: string;
  dateOfBirth: string;
  bloodGroup: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientInitials: string;
  doctorId?: string;
  doctorName: string;
  specialty: string;
  visitType: string;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
}

export interface Prescription {
  id: string;
  patientId?: string;
  doctorId?: string;
  patientName: string;
  drugName: string;
  dosage: string;
  frequency: string;
  timing: string;
  refillsLeft: number;
  status: 'Active' | 'Completed' | 'Pending';
  instructions?: string;
}

export interface PrescriptionEntry {
  name: string;
  dosage: string;
  instructions?: string;
  duration?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId?: string;
  patientName: string;
  patientAge: number;
  date: string;
  encounterType: 'CLINIC VISIT' | 'TELEHEALTH' | 'LAB RESULTS';
  attendingPhysician: string;
  diagnosis: string;
  symptoms: string;
  clinicalNotes: string;
  prescriptions: PrescriptionEntry[];
}

export interface Biometrics {
  patientId?: string;
  bloodPressure: string;
  bloodPressureStatus: string;
  weightLbs: number;
  weightChangeLbs: number;
  avgDailySteps: number;
  stepGoal: number;
}

export interface AvailabilitySlot {
  id: string;
  doctorId?: string;
  timeRange: string;
  date?: string;
  isBooked?: boolean;
}

export interface ClinicalFeedItem {
  id: string;
  time: string;
  text: string;
  patientName?: string;
  type: 'lab' | 'urgent' | 'protocol';
}

export type PaymentType = 'due' | 'consultation' | 'prescription' | 'general';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface PaymentItem {
  id: number | string;
  userId?: number | string;
  type: PaymentType;
  amount: number;
  description: string;
  dueDate?: string;
  status: PaymentStatus;
  stripeSessionId?: string;
  referenceId?: number | string;
  createdAt?: string;
}

