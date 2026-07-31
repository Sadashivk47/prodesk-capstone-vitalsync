import apiClient from './axios';
import {
  User,
  Role,
  Appointment,
  Prescription,
  MedicalRecord,
  Biometrics,
  AvailabilitySlot,
  ClinicalFeedItem,
  DoctorProfile,
  PatientProfile,
  PaymentItem,
} from '../types';

export const authApi = {
  async login(email: string, password?: string): Promise<{ token: string; user: User }> {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },

  async register(data: { email: string; name: string; role: Role; specialty?: string; password?: string }): Promise<{ token: string; user: User }> {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },

  async getMe(): Promise<{ user: User }> {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
};

export const doctorsApi = {
  async getDoctors(): Promise<User[]> {
    const res = await apiClient.get('/doctors');
    return res.data;
  },

  async getDoctorProfile(userId: string): Promise<DoctorProfile> {
    const res = await apiClient.get(`/doctors/profile/${userId}`);
    return res.data;
  },
};

export const patientsApi = {
  async getPatients(): Promise<Array<{ id: string; name: string; age: number; idCode: string; avatarUrl: string; status: string }>> {
    const res = await apiClient.get('/patients');
    return res.data;
  },

  async getPatientProfile(userId: string): Promise<PatientProfile> {
    const res = await apiClient.get(`/patients/profile/${userId}`);
    return res.data;
  },

  async createPatient(data: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth?: string;
    bloodGroup?: string;
    medicalRecordNumber?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
  }): Promise<{ id: string; name: string }> {
    const res = await apiClient.post('/patients', data);
    return res.data;
  },
};

export const appointmentsApi = {
  async getAppointments(params?: { doctorId?: string; patientId?: string }): Promise<Appointment[]> {
    const res = await apiClient.get('/appointments', { params });
    return res.data;
  },

  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    const res = await apiClient.post('/appointments', data);
    return res.data;
  },

  async updateStatus(id: string, status: string): Promise<Appointment> {
    const res = await apiClient.patch(`/appointments/${id}`, { status });
    return res.data;
  },

  async deleteAppointment(id: string): Promise<{ success: boolean }> {
    const res = await apiClient.delete(`/appointments/${id}`);
    return res.data;
  },
};

export const availabilityApi = {
  async getSlots(doctorId?: string): Promise<AvailabilitySlot[]> {
    const res = await apiClient.get('/availability', { params: { doctorId } });
    return res.data;
  },

  async createSlot(timeRange: string, date?: string): Promise<AvailabilitySlot> {
    const res = await apiClient.post('/availability', { timeRange, date });
    return res.data;
  },

  async deleteSlot(id: string): Promise<{ success: boolean }> {
    const res = await apiClient.delete(`/availability/${id}`);
    return res.data;
  },
};

export const medicalRecordsApi = {
  async getRecords(patientId?: string): Promise<MedicalRecord[]> {
    const res = await apiClient.get('/medical-records', { params: { patientId } });
    return res.data;
  },

  async createRecord(data: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const res = await apiClient.post('/medical-records', data);
    return res.data;
  },
};

export const prescriptionsApi = {
  async getPrescriptions(params?: { patientId?: string; patientName?: string }): Promise<Prescription[]> {
    const res = await apiClient.get('/prescriptions', { params });
    return res.data;
  },

  async createPrescription(data: Partial<Prescription>): Promise<Prescription> {
    const res = await apiClient.post('/prescriptions', data);
    return res.data;
  },
};

export const clinicalFeedApi = {
  async getFeed(): Promise<ClinicalFeedItem[]> {
    const res = await apiClient.get('/clinical-feed');
    return res.data;
  },
};

export const biometricsApi = {
  async getBiometrics(patientId?: string): Promise<Biometrics> {
    const res = await apiClient.get('/biometrics', { params: { patientId } });
    return res.data;
  },

  async updateBiometrics(data: Partial<Biometrics>): Promise<Biometrics> {
    const res = await apiClient.put('/biometrics', data);
    return res.data;
  },
};

export const aiApi = {
  async generateClinicalSummary(patientData: any, prompt?: string): Promise<{ summary: string; recommendations?: string[] }> {
    const res = await apiClient.post('/ai/clinical-summary', { patientData, prompt });
    return res.data;
  },
};

export const paymentsApi = {
  async getPayments(): Promise<PaymentItem[]> {
    const res = await apiClient.get('/payments');
    return res.data;
  },

  async createCheckoutSession(data: {
    type: 'due' | 'consultation' | 'prescription' | 'general';
    amount: number;
    description: string;
    referenceId?: number;
    dueDate?: string;
  }): Promise<{ checkoutUrl: string; sessionId: string; paymentId: number }> {
    const res = await apiClient.post('/payments/create-checkout-session', data);
    return res.data;
  },

  async confirmPayment(paymentId: number | string, sessionId: string): Promise<{ success: boolean; message: string; payment: PaymentItem }> {
    const res = await apiClient.post('/payments/confirm', { paymentId: Number(paymentId), sessionId });
    return res.data;
  },
};

