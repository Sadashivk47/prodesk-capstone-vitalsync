import {
  User,
  Appointment,
  Prescription,
  MedicalRecord,
  Biometrics,
  AvailabilitySlot,
  ClinicalFeedItem,
} from '../types';

export const INITIAL_DOCTOR_USER: User = {
  id: 'doc-101',
  email: 'dr.smith@hospital.com',
  name: 'Dr. Sarah Miller',
  role: 'doctor',
  title: 'Lead Cardiologist',
  specialty: 'Cardiology',
  avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200',
};

export const INITIAL_PATIENT_USER: User = {
  id: 'pat-202',
  email: 'sarah.johnson@patient.com',
  name: 'Sarah Johnson',
  role: 'patient',
  title: 'Member since 2022',
  memberSince: '2022',
  avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
};

export const INITIAL_PATIENTS: Array<{ id: string; name: string; age: number; idCode: string; avatarUrl: string; status: string }> = [
  {
    id: 'pat-emily-chen',
    name: 'Emily Chen',
    age: 28,
    idCode: '#VC-9821-EC',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    status: 'ACTIVE FILE',
  },
  {
    id: 'pat-john-doe',
    name: 'John Doe',
    age: 45,
    idCode: '#VC-1042-JD',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    status: 'ACTIVE FILE',
  },
  {
    id: 'pat-mark-adams',
    name: 'Mark Adams',
    age: 52,
    idCode: '#VC-3391-MA',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    status: 'ACTIVE FILE',
  },
  {
    id: 'pat-sarah-lee',
    name: 'Sarah Lee',
    age: 34,
    idCode: '#VC-8820-SL',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    status: 'ACTIVE FILE',
  },
];

export const INITIAL_TODAYS_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-101',
    patientId: 'pat-john-doe',
    patientName: 'John Doe',
    patientInitials: 'JD',
    doctorName: 'Dr. Sarah Miller',
    specialty: 'Cardiology',
    visitType: 'Annual Checkup',
    date: '2024-10-24',
    time: '09:00 AM',
    reason: 'Annual Checkup',
    status: 'SCHEDULED',
  },
  {
    id: 'appt-102',
    patientId: 'pat-emily-chen',
    patientName: 'Emily Chen',
    patientInitials: 'EC',
    doctorName: 'Dr. Sarah Miller',
    specialty: 'Cardiology',
    visitType: 'Consultation',
    date: '2024-10-24',
    time: '10:30 AM',
    reason: 'Consultation',
    status: 'COMPLETED',
  },
  {
    id: 'appt-103',
    patientId: 'pat-mark-adams',
    patientName: 'Mark Adams',
    patientInitials: 'MA',
    doctorName: 'Dr. Sarah Miller',
    specialty: 'Cardiology',
    visitType: 'Follow-up',
    date: '2024-10-24',
    time: '11:15 AM',
    reason: 'Follow-up',
    status: 'CANCELLED',
  },
  {
    id: 'appt-104',
    patientId: 'pat-sarah-lee',
    patientName: 'Sarah Lee',
    patientInitials: 'SL',
    doctorName: 'Dr. Sarah Miller',
    specialty: 'Cardiology',
    visitType: 'Lab Review',
    date: '2024-10-24',
    time: '01:45 PM',
    reason: 'Lab Review',
    status: 'SCHEDULED',
  },
];

export const INITIAL_PATIENT_UPCOMING_APPOINTMENTS: Appointment[] = [
  {
    id: 'p-appt-1',
    patientId: 'pat-202',
    patientName: 'Sarah Johnson',
    patientInitials: 'SJ',
    doctorName: 'Dr. James Wilson',
    specialty: 'Cardiology',
    visitType: 'Specialist Visit',
    date: 'Oct 28, 2023',
    time: '10:00 AM',
    reason: 'Specialist Visit',
    status: 'SCHEDULED',
  },
  {
    id: 'p-appt-2',
    patientId: 'pat-202',
    patientName: 'Sarah Johnson',
    patientInitials: 'SJ',
    doctorName: 'Dr. Elena Rodriguez',
    specialty: 'General Practitioner',
    visitType: 'Annual Wellness',
    date: 'Nov 12, 2023',
    time: '02:30 PM',
    reason: 'Annual Wellness',
    status: 'SCHEDULED',
  },
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-1',
    patientName: 'Sarah Johnson',
    drugName: 'Lisinopril 10mg',
    dosage: '10mg Oral Tablet',
    frequency: 'Once daily',
    timing: 'Morning',
    refillsLeft: 2,
    status: 'Active',
    instructions: 'Take 1 tablet daily in the morning with water.',
  },
  {
    id: 'rx-2',
    patientName: 'Sarah Johnson',
    drugName: 'Atorvastatin 20mg',
    dosage: '20mg Tablet',
    frequency: 'Daily',
    timing: 'Before bed',
    refillsLeft: 1,
    status: 'Active',
    instructions: 'Take 1 tablet at night before sleeping.',
  },
  {
    id: 'rx-3',
    patientName: 'Emily Chen',
    drugName: 'Amoxicillin 500mg',
    dosage: '500mg Capsule',
    frequency: 'Twice daily',
    timing: 'After meals',
    refillsLeft: 0,
    status: 'Completed',
    instructions: 'Complete full 7-day course.',
  },
];

export const INITIAL_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'rec-101',
    patientId: 'pat-emily-chen',
    patientName: 'Emily Chen',
    patientAge: 28,
    date: 'OCT 12, 2023',
    encounterType: 'CLINIC VISIT',
    attendingPhysician: 'Dr. Sarah Miller',
    diagnosis: 'Acute Sinusitis',
    symptoms: 'Persistent headache, nasal congestion, low-grade fever.',
    clinicalNotes:
      'Patient reports symptoms started 5 days ago. Prescribed antibiotics and recommended rest. Temperature recorded at 99.8°F, physical examination shows inflammation in maxillary sinuses.',
    prescriptions: [
      {
        name: 'Amoxicillin 500mg',
        dosage: '1 tablet twice daily',
        duration: '7 Days',
      },
    ],
  },
  {
    id: 'rec-102',
    patientId: 'pat-emily-chen',
    patientName: 'Emily Chen',
    patientAge: 28,
    date: 'AUG 24, 2023',
    encounterType: 'TELEHEALTH',
    attendingPhysician: 'Dr. James Wilson',
    diagnosis: 'Seasonal Allergies',
    symptoms: 'Sneezing, itchy watery eyes, mild fatigue.',
    clinicalNotes:
      'Symptoms recurring annually during late summer. Advised avoidance of outdoor triggers during peak pollen hours and started daily antihistamines.',
    prescriptions: [
      {
        name: 'Loratadine 10mg',
        dosage: '1 tablet once daily, as needed',
      },
    ],
  },
  {
    id: 'rec-103',
    patientId: 'pat-emily-chen',
    patientName: 'Emily Chen',
    patientAge: 28,
    date: 'MAY 15, 2023',
    encounterType: 'LAB RESULTS',
    attendingPhysician: 'Dr. Sarah Miller',
    diagnosis: 'Annual Wellness Screening',
    symptoms: 'General health check. BP: 118/75, HR: 72 bpm.',
    clinicalNotes:
      'Vitals stable. All lab values within normal range. Vitamin D slightly low (28 ng/mL). Recommended daily Vitamin D supplementation and outdoor morning activity.',
    prescriptions: [
      {
        name: 'Vitamin D3 2000IU',
        dosage: '1 softgel daily',
      },
    ],
  },
];

export const INITIAL_BIOMETRICS: Biometrics = {
  bloodPressure: '118/76',
  bloodPressureStatus: 'Optimal',
  weightLbs: 142,
  weightChangeLbs: -2,
  avgDailySteps: 8420,
  stepGoal: 10000,
};

export const INITIAL_AVAILABILITY_SLOTS: AvailabilitySlot[] = [
  { id: 'slot-1', timeRange: '02:00 PM - 03:00 PM' },
  { id: 'slot-2', timeRange: '03:30 PM - 04:30 PM' },
  { id: 'slot-3', timeRange: '05:00 PM - 05:30 PM' },
];

export const INITIAL_CLINICAL_FEED: ClinicalFeedItem[] = [
  {
    id: 'feed-1',
    time: '10:45 AM',
    text: 'Lab results received for Emily Chen. Hematology report ready.',
    patientName: 'Emily Chen',
    type: 'lab',
  },
  {
    id: 'feed-2',
    time: '09:15 AM',
    text: 'Urgent prescription refill request from pharmacy (RX: #44921).',
    type: 'urgent',
  },
  {
    id: 'feed-3',
    time: 'Yesterday',
    text: 'Updated clinical protocols for hypertension management uploaded.',
    type: 'protocol',
  },
];
