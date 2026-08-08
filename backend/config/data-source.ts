import "reflect-metadata";
import { DataSource } from "typeorm";
import { Logger } from "@nestjs/common";
import dotenv from "dotenv";

import { User } from "../entities/User.js";
import { DoctorProfile } from "../entities/DoctorProfile.js";
import { PatientProfile } from "../entities/PatientProfile.js";
import { PatientDirectory } from "../entities/PatientDirectory.js";
import { Appointment } from "../entities/Appointment.js";
import { AvailabilitySlot } from "../entities/AvailabilitySlot.js";
import { MedicalRecord } from "../entities/MedicalRecord.js";
import { Prescription } from "../entities/Prescription.js";
import { ClinicalFeed } from "../entities/ClinicalFeed.js";
import { Biometric } from "../entities/Biometric.js";
import { Payment } from "../entities/Payment.js";

dotenv.config();

// Phase 3 — Replace console.log with NestJS Logger
// Logger is environment-aware: can be silenced in production without code changes.
const dbLogger = new Logger("DataSource");

let rawDbUrl = process.env.DATABASE_URL;
if (rawDbUrl) {
  rawDbUrl = rawDbUrl.replace(/&?channel_binding=[^&]*/g, '');
}

export const AppDataSource = new DataSource({
  type: "postgres",
  url: rawDbUrl || "postgresql://postgres:postgres@localhost:5432/vitalsync",
  ssl: rawDbUrl && !rawDbUrl.includes("localhost") ? { rejectUnauthorized: false } : false,
  synchronize: true, // Auto-sync entities schema with Neon DB
  logging: false,
  entities: [
    User,
    DoctorProfile,
    PatientProfile,
    PatientDirectory,
    Appointment,
    AvailabilitySlot,
    MedicalRecord,
    Prescription,
    ClinicalFeed,
    Biometric,
    Payment,
  ],
  subscribers: [],
  migrations: [],
});

// ============================================================
// In-Memory Fallback Storage Engine
// ============================================================
class InMemoryRepository {
  private items: any[] = [];

  constructor(initialItems: any[] = []) {
    this.items = [...initialItems];
  }

  create(data: any) {
    return { ...data };
  }

  async save(entityOrEntities: any) {
    if (Array.isArray(entityOrEntities)) {
      return entityOrEntities.map((e) => this.saveSync(e));
    }
    return this.saveSync(entityOrEntities);
  }

  private saveSync(entity: any) {
    const key = entity.id ?? entity.patientId ?? entity.userId;
    const index = this.items.findIndex(
      (i) => (i.id != null && i.id === key) || (i.patientId != null && i.patientId === key) || (i.userId != null && i.userId === key)
    );
    if (index >= 0) {
      this.items[index] = { ...this.items[index], ...entity };
      return this.items[index];
    } else {
      this.items.push(entity);
      return entity;
    }
  }

  async find(options?: { where?: any; order?: any }) {
    let result = [...this.items];
    if (options?.where && Object.keys(options.where).length > 0) {
      result = result.filter((item) => {
        return Object.entries(options.where).every(([k, v]) => {
          if (v === undefined) return true;
          return String(item[k] ?? "").toLowerCase() === String(v).toLowerCase();
        });
      });
    }
    return result;
  }

  async findOne(options?: { where?: any }) {
    const res = await this.find(options);
    return res[0] || null;
  }

  async update(idOrWhere: any, patch: any) {
    const key = typeof idOrWhere === "object" ? idOrWhere.id : idOrWhere;
    const index = this.items.findIndex((i) => i.id === key || i.patientId === key || i.userId === key);
    if (index >= 0) {
      this.items[index] = { ...this.items[index], ...patch };
    }
    return { affected: index >= 0 ? 1 : 0 };
  }

  async delete(idOrWhere: any) {
    const key = typeof idOrWhere === "object" ? idOrWhere.id : idOrWhere;
    this.items = this.items.filter((i) => i.id !== key && i.patientId !== key && i.userId !== key);
    return { affected: 1 };
  }

  async count(options?: { where?: any }) {
    const res = await this.find(options);
    return res.length;
  }
}

// Global In-Memory Stores Map
const inMemoryStores = new Map<any, InMemoryRepository>();

function getInMemoryStore(entityClass: any): InMemoryRepository {
  if (!inMemoryStores.has(entityClass)) {
    inMemoryStores.set(entityClass, new InMemoryRepository());
  }
  return inMemoryStores.get(entityClass)!;
}

// ============================================================
// Seed password hash — Password@123
// ============================================================
const SEED_PASSWORD_HASH = "$2b$10$RnePUeytnMqzTNjxE2jbDu8S6fLHcCdQKRZY86RKO2kjt6Y2sZxmy";

// ============================================================
// populateInMemorySeeds
// All IDs are integers matching the SQL schema seed data.
// Field names match the fixed entity property names.
// ============================================================
function populateInMemorySeeds() {
  // ── Users ────────────────────────────────────────────────
  getInMemoryStore(User).save([
    {
      id: 1,
      email: "sarah.miller@vitalsync.dev",
      passwordHash: SEED_PASSWORD_HASH,
      firstName: "Sarah",
      lastName: "Miller",
      role: "doctor",
      title: "Lead Cardiologist",
      specialty: "Cardiology",
      avatarUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200",
      memberSince: "2020",
    },
    {
      id: 2,
      email: "rohan.mehta@vitalsync.dev",
      passwordHash: SEED_PASSWORD_HASH,
      firstName: "Rohan",
      lastName: "Mehta",
      role: "doctor",
      title: "General Practitioner",
      specialty: "General Medicine",
      avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200",
      memberSince: "2019",
    },
    {
      id: 3,
      email: "ananya.krishnan@vitalsync.dev",
      passwordHash: SEED_PASSWORD_HASH,
      firstName: "Ananya",
      lastName: "Krishnan",
      role: "doctor",
      title: "Dermatologist",
      specialty: "Dermatology",
      avatarUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200",
      memberSince: "2021",
    },
    {
      id: 4,
      email: "vikram.rao@vitalsync.dev",
      passwordHash: SEED_PASSWORD_HASH,
      firstName: "Vikram",
      lastName: "Rao",
      role: "doctor",
      title: "Orthopedic Surgeon",
      specialty: "Orthopedics",
      avatarUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200",
      memberSince: "2018",
    },
    {
      id: 5,
      email: "priya.desai@vitalsync.dev",
      passwordHash: SEED_PASSWORD_HASH,
      firstName: "Priya",
      lastName: "Desai",
      role: "doctor",
      title: "Pediatrician",
      specialty: "Pediatrics",
      avatarUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200",
      memberSince: "2020",
    },
    {
      id: 6,
      email: "sarah.johnson@vitalsync.dev",
      passwordHash: SEED_PASSWORD_HASH,
      firstName: "Sarah",
      lastName: "Johnson",
      role: "patient",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
      memberSince: "2022",
    },
    {
      id: 7,
      email: "emily.chen@vitalsync.dev",
      passwordHash: SEED_PASSWORD_HASH,
      firstName: "Emily",
      lastName: "Chen",
      role: "patient",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      memberSince: "2021",
    },
    {
      id: 8,
      email: "arjun.nair@vitalsync.dev",
      passwordHash: SEED_PASSWORD_HASH,
      firstName: "Arjun",
      lastName: "Nair",
      role: "patient",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      memberSince: "2022",
    },
    {
      id: 13,
      email: "john.doe@vitalsync.dev",
      passwordHash: SEED_PASSWORD_HASH,
      firstName: "John",
      lastName: "Doe",
      role: "patient",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      memberSince: "2023",
    },
  ]);

  // ── Doctor Profiles ──────────────────────────────────────
  getInMemoryStore(DoctorProfile).save([
    { id: 1, userId: 1, specialty: "Cardiology",      yearsExperience: 12, licenseNumber: "MCI-TS-10234", bio: "Lead Cardiologist specializing in preventive cardiac care." },
    { id: 2, userId: 2, specialty: "General Medicine", yearsExperience:  8, licenseNumber: "MCI-TS-10871", bio: "Focuses on holistic primary care and chronic disease management." },
    { id: 3, userId: 3, specialty: "Dermatology",      yearsExperience:  6, licenseNumber: "MCI-TS-11290", bio: "Specializes in clinical and cosmetic dermatology." },
    { id: 4, userId: 4, specialty: "Orthopedics",      yearsExperience: 10, licenseNumber: "MCI-TS-10456", bio: "Sports medicine and joint-care specialist." },
    { id: 5, userId: 5, specialty: "Pediatrics",       yearsExperience:  9, licenseNumber: "MCI-TS-10998", bio: "Focuses on child wellness and developmental care." },
  ]);

  // ── Patient Profiles ─────────────────────────────────────
  getInMemoryStore(PatientProfile).save([
    { id: 1, userId: 6,  medicalRecordNumber: "VS-MRN-9821", dateOfBirth: "2000-03-14", bloodGroup: "O+",  emergencyContactName: "Family Contact", emergencyContactPhone: "+91-90000-10001" },
    { id: 2, userId: 7,  medicalRecordNumber: "VS-MRN-9822", dateOfBirth: "1994-11-02", bloodGroup: "A+",  emergencyContactName: "Family Contact", emergencyContactPhone: "+91-90000-10002" },
    { id: 3, userId: 8,  medicalRecordNumber: "VS-MRN-9823", dateOfBirth: "1998-06-21", bloodGroup: "B+",  emergencyContactName: "Family Contact", emergencyContactPhone: "+91-90000-10003" },
    { id: 8, userId: 13, medicalRecordNumber: "VS-MRN-9828", dateOfBirth: "1991-09-23", bloodGroup: "O+",  emergencyContactName: "Family Contact", emergencyContactPhone: "+91-90000-10008" },
  ]);

  // ── Patient Directory ────────────────────────────────────
  getInMemoryStore(PatientDirectory).save([
    { id: 1, name: "Sarah Johnson", age: 26, idCode: "VS-MRN-9821", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200", status: "ACTIVE FILE" },
    { id: 2, name: "Emily Chen",    age: 32, idCode: "VS-MRN-9822", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200", status: "ACTIVE FILE" },
    { id: 3, name: "Arjun Nair",    age: 28, idCode: "VS-MRN-9823", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", status: "ACTIVE FILE" },
    { id: 4, name: "Kavya Reddy",   age: 37, idCode: "VS-MRN-9824", avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200", status: "ACTIVE FILE" },
    { id: 5, name: "Rahul Iyer",    age: 30, idCode: "VS-MRN-9825", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200", status: "ACTIVE FILE" },
    { id: 8, name: "John Doe",      age: 35, idCode: "VS-MRN-9828", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", status: "ACTIVE FILE" },
  ]);

  // ── Appointments ─────────────────────────────────────────
  // doctorId/patientId are integer user IDs; appointmentDate is a Date object
  getInMemoryStore(Appointment).save([
    { id: 1, doctorId: 1, patientId: 6,  appointmentDate: new Date("2026-07-24T09:00:00"), status: "scheduled", reasonForVisit: "Annual cardiac checkup"                           },
    { id: 2, doctorId: 1, patientId: 7,  appointmentDate: new Date("2026-07-24T10:30:00"), status: "completed", reasonForVisit: "Consultation for chest tightness"                 },
    { id: 3, doctorId: 1, patientId: 13, appointmentDate: new Date("2026-07-24T11:15:00"), status: "cancelled", reasonForVisit: "Follow-up on hypertension"                        },
    { id: 4, doctorId: 2, patientId: 8,  appointmentDate: new Date("2026-07-25T09:00:00"), status: "scheduled", reasonForVisit: "General wellness check"                           },
    { id: 5, doctorId: 2, patientId: 13, appointmentDate: new Date("2026-07-20T09:45:00"), status: "completed", reasonForVisit: "Persistent nasal congestion, low-grade fever"     },
    { id: 6, doctorId: 3, patientId: 8,  appointmentDate: new Date("2026-07-26T10:00:00"), status: "scheduled", reasonForVisit: "Recurring seasonal skin allergy"                  },
    { id: 7, doctorId: 4, patientId: 13, appointmentDate: new Date("2026-07-22T15:00:00"), status: "completed", reasonForVisit: "Knee pain after running"                          },
  ]);

  // ── Availability Slots ───────────────────────────────────
  // doctorId is integer; startTime/endTime are Date objects
  getInMemoryStore(AvailabilitySlot).save([
    { id: 1, doctorId: 1, startTime: new Date("2026-07-27T09:00:00"), endTime: new Date("2026-07-27T09:30:00"), isBooked: true  },
    { id: 2, doctorId: 1, startTime: new Date("2026-07-27T10:30:00"), endTime: new Date("2026-07-27T11:00:00"), isBooked: false },
    { id: 3, doctorId: 1, startTime: new Date("2026-07-27T14:00:00"), endTime: new Date("2026-07-27T14:30:00"), isBooked: false },
    { id: 4, doctorId: 2, startTime: new Date("2026-07-27T09:00:00"), endTime: new Date("2026-07-27T09:30:00"), isBooked: false },
    { id: 5, doctorId: 2, startTime: new Date("2026-07-27T11:15:00"), endTime: new Date("2026-07-27T11:45:00"), isBooked: true  },
    { id: 6, doctorId: 3, startTime: new Date("2026-07-28T10:00:00"), endTime: new Date("2026-07-28T10:30:00"), isBooked: false },
    { id: 7, doctorId: 4, startTime: new Date("2026-07-28T15:00:00"), endTime: new Date("2026-07-28T15:30:00"), isBooked: false },
  ]);

  // ── Medical Records ──────────────────────────────────────
  // patientId/doctorId are integer user IDs; notes (not clinicalNotes); recordedAt (not recorded_at/createdAt)
  getInMemoryStore(MedicalRecord).save([
    {
      id: 1,
      patientId: 7,  // Emily Chen
      doctorId: 1,   // Dr. Sarah Miller
      diagnosis: "Acute Sinusitis",
      symptoms: "Persistent headache, nasal congestion, low-grade fever.",
      notes: "Patient reports symptoms started 5 days ago. Prescribed antibiotics and recommended rest.",
      recordedAt: new Date("2026-07-23T10:45:00"),
    },
    {
      id: 2,
      patientId: 7,  // Emily Chen
      doctorId: 3,   // Dr. Ananya Krishnan
      diagnosis: "Seasonal Allergies",
      symptoms: "Sneezing, watery itchy eyes, mild fatigue.",
      notes: "Symptoms recurring annually during late summer. Advised avoidance of triggers and started antihistamines.",
      recordedAt: new Date("2026-07-24T09:15:00"),
    },
    {
      id: 3,
      patientId: 6,  // Sarah Johnson
      doctorId: 1,
      diagnosis: "Annual Wellness Screening",
      symptoms: "None reported",
      notes: "General check. BP 118/75, HR 72bpm. Vitals stable. All lab values within normal range. Vitamin D slightly low (28 ng/mL).",
      recordedAt: new Date("2026-05-15T11:00:00"),
    },
    {
      id: 4,
      patientId: 13, // John Doe
      doctorId: 4,   // Dr. Vikram Rao (orthopedics)
      diagnosis: "Patellar Tendinitis",
      symptoms: "Knee pain after running, mild swelling.",
      notes: "Recommended rest, ice, and physiotherapy for 2 weeks.",
      recordedAt: new Date("2026-07-22T15:30:00"),
    },
    {
      id: 5,
      patientId: 13, // John Doe
      doctorId: 2,   // Dr. Rohan Mehta
      diagnosis: "Viral Upper Respiratory Infection",
      symptoms: "Nasal congestion, sore throat, low-grade fever.",
      notes: "Supportive care advised; follow up if fever persists beyond 3 days.",
      recordedAt: new Date("2026-07-20T10:00:00"),
    },
  ]);

  // ── Prescriptions ────────────────────────────────────────
  // id is integer; appointmentId is integer; medicationName (not drugName)
  getInMemoryStore(Prescription).save([
    { id: 1, appointmentId: 2, medicationName: "Amoxicillin", dosage: "500mg",  frequency: "Once daily, morning",    durationDays: 7  },
    { id: 2, appointmentId: 2, medicationName: "Lisinopril",  dosage: "10mg",   frequency: "Once daily, morning",    durationDays: 30 },
    { id: 3, appointmentId: 5, medicationName: "Loratadine",  dosage: "10mg",   frequency: "Once daily, as needed",  durationDays: 14 },
    { id: 4, appointmentId: 5, medicationName: "Vitamin D3",  dosage: "2000IU", frequency: "Once daily, softgel",    durationDays: 60 },
    { id: 5, appointmentId: 6, medicationName: "Atorvastatin",dosage: "20mg",   frequency: "Once daily, before bed", durationDays: 30 },
    { id: 6, appointmentId: 7, medicationName: "Ibuprofen",   dosage: "400mg",  frequency: "Twice daily, after food",durationDays: 5  },
  ]);

  // ── Clinical Feed ─────────────────────────────────────────
  // id is integer; time field maps to event_time column
  getInMemoryStore(ClinicalFeed).save([
    { id: 1, time: "10:45 AM", text: "Lab results received for Emily Chen. Hematology report ready.",              patientName: "Emily Chen",    type: "lab"         },
    { id: 2, time: "09:15 AM", text: "Urgent prescription refill request from pharmacy (RX: #44921).",             patientName: null,            type: "urgent"      },
    { id: 3, time: "08:30 AM", text: "New appointment scheduled: Sarah Johnson → Dr. Rohan Mehta (Jul 27 09:00).",patientName: "Sarah Johnson", type: "appointment" },
  ]);

  // ── Biometrics ───────────────────────────────────────────
  // id is integer; patientId is integer user ID
  getInMemoryStore(Biometric).save([
    { id: 1, patientId: 6,  bloodPressure: "118/76", bloodPressureStatus: "Optimal",  weightLbs: 142, weightChangeLbs: -2, avgDailySteps: 8420, stepGoal: 10000 },
    { id: 2, patientId: 7,  bloodPressure: "122/80", bloodPressureStatus: "Normal",   weightLbs: 135, weightChangeLbs:  0, avgDailySteps: 6200, stepGoal:  8000 },
    { id: 3, patientId: 8,  bloodPressure: "115/75", bloodPressureStatus: "Optimal",  weightLbs: 160, weightChangeLbs:  1, avgDailySteps: 5100, stepGoal:  7500 },
    { id: 8, patientId: 13, bloodPressure: "130/85", bloodPressureStatus: "Elevated", weightLbs: 180, weightChangeLbs: -1, avgDailySteps: 3800, stepGoal:  6000 },
  ]);

  // ── Payments & Doctor Dues ──────────────────────────────────
  getInMemoryStore(Payment).save([
    { id: 1, userId: 1, type: "due",          amount: 250.00, description: "Monthly Clinic Facility & Maintenance Fee", dueDate: new Date("2026-08-15"), status: "pending" },
    { id: 2, userId: 1, type: "due",          amount: 120.00, description: "Medical License & Malpractice Protection Renewal", dueDate: new Date("2026-08-30"), status: "pending" },
    { id: 3, userId: 1, type: "due",          amount: 75.00,  description: "Annual Telehealth Platform Infrastructure Fee", dueDate: new Date("2026-07-01"), status: "paid" },
    { id: 4, userId: 2, type: "due",          amount: 200.00, description: "General Clinic Administration & EHR Sync Fee", dueDate: new Date("2026-08-10"), status: "pending" },
    { id: 5, userId: 6, type: "consultation", amount: 80.00,  description: "Cardiology Virtual Consultation Fee", status: "paid" },
    { id: 6, userId: 13, type: "prescription", amount: 45.00, description: "Amoxicillin & Loratadine Prescription Order", status: "pending", referenceId: 1 },
    { id: 7, userId: 13, type: "general",      amount: 50.00,  description: "Lab Processing & Diagnostic Co-pay", status: "pending" },
  ]);
}

populateInMemorySeeds();

// ============================================================
// Smart Safe Repository Proxy
// Tries real TypeORM repo first; falls back to in-memory store.
// ============================================================
export function getSafeRepository<T = any>(entityClass: any): any {
  return new Proxy({}, {
    get(_target, prop) {
      if (AppDataSource.isInitialized) {
        try {
          const realRepo = AppDataSource.getRepository(entityClass) as any;
          const val = realRepo[prop];
          if (typeof val === "function") {
            return val.bind(realRepo);
          }
          return val;
        } catch (err) {
          console.warn("[getSafeRepository] Real repo error, using fallback:", err);
        }
      }
      const memRepo = getInMemoryStore(entityClass) as any;
      const val = memRepo[prop];
      if (typeof val === "function") {
        return val.bind(memRepo);
      }
      return val;
    }
  });
}

export async function initializeDatabase() {
  let dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    dbUrl = dbUrl.replace(/&?channel_binding=[^&]*/g, '');
  }

  if (!dbUrl || dbUrl.includes("localhost")) {
    dbLogger.log("No external DATABASE_URL. Using In-Memory Repository Layer.");
    return;
  }

  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      dbLogger.log("Connected to Neon PostgreSQL Database successfully.");
      await seedDatabaseIfEmpty();
    }
  } catch (error) {
    dbLogger.warn("PostgreSQL connection failed. Falling back to in-memory store.");
  }
}

// ============================================================
// seedDatabaseIfEmpty — only runs when a real DB is connected
// and the users table is empty.
// ============================================================
async function seedDatabaseIfEmpty() {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const count = await userRepo.count();
    if (count === 0) {
      dbLogger.log("Database is empty. Seeding initial clinical data...");

      // ── Users (matches schema seed: doctors 1-5, patients 6-13)
      const usersData = [
        { email: "sarah.miller@vitalsync.dev",    passwordHash: SEED_PASSWORD_HASH, firstName: "Sarah",  lastName: "Miller",   role: "doctor"  as const },
        { email: "rohan.mehta@vitalsync.dev",     passwordHash: SEED_PASSWORD_HASH, firstName: "Rohan",  lastName: "Mehta",    role: "doctor"  as const },
        { email: "ananya.krishnan@vitalsync.dev", passwordHash: SEED_PASSWORD_HASH, firstName: "Ananya", lastName: "Krishnan", role: "doctor"  as const },
        { email: "vikram.rao@vitalsync.dev",      passwordHash: SEED_PASSWORD_HASH, firstName: "Vikram", lastName: "Rao",      role: "doctor"  as const },
        { email: "priya.desai@vitalsync.dev",     passwordHash: SEED_PASSWORD_HASH, firstName: "Priya",  lastName: "Desai",    role: "doctor"  as const },
        { email: "sarah.johnson@vitalsync.dev",   passwordHash: SEED_PASSWORD_HASH, firstName: "Sarah",  lastName: "Johnson",  role: "patient" as const },
        { email: "emily.chen@vitalsync.dev",      passwordHash: SEED_PASSWORD_HASH, firstName: "Emily",  lastName: "Chen",     role: "patient" as const },
        { email: "arjun.nair@vitalsync.dev",      passwordHash: SEED_PASSWORD_HASH, firstName: "Arjun",  lastName: "Nair",     role: "patient" as const },
        { email: "kavya.reddy@vitalsync.dev",     passwordHash: SEED_PASSWORD_HASH, firstName: "Kavya",  lastName: "Reddy",    role: "patient" as const },
        { email: "rahul.iyer@vitalsync.dev",      passwordHash: SEED_PASSWORD_HASH, firstName: "Rahul",  lastName: "Iyer",     role: "patient" as const },
        { email: "meera.pillai@vitalsync.dev",    passwordHash: SEED_PASSWORD_HASH, firstName: "Meera",  lastName: "Pillai",   role: "patient" as const },
        { email: "aditya.sharma@vitalsync.dev",   passwordHash: SEED_PASSWORD_HASH, firstName: "Aditya", lastName: "Sharma",   role: "patient" as const },
        { email: "john.doe@vitalsync.dev",        passwordHash: SEED_PASSWORD_HASH, firstName: "John",   lastName: "Doe",      role: "patient" as const },
      ];
      const savedUsers = await userRepo.save(userRepo.create(usersData));
      // Indices: 0=Sarah Miller(doc1), 1=Rohan Mehta(doc2), 2=Ananya(doc3), 3=Vikram(doc4), 4=Priya(doc5)
      //          5=Sarah Johnson(pat6), 6=Emily Chen(pat7), 7=Arjun(pat8), 12=John Doe(pat13)
      const [doc1, doc2, doc3, doc4, , pat6, pat7, pat8, , , , , pat13] = savedUsers;

      // ── Doctor Profiles
      const docRepo = AppDataSource.getRepository(DoctorProfile);
      await docRepo.save([
        docRepo.create({ userId: doc1.id, specialty: "Cardiology",      yearsExperience: 12, licenseNumber: "MCI-TS-10234", bio: "Lead Cardiologist specializing in preventive cardiac care." }),
        docRepo.create({ userId: doc2.id, specialty: "General Medicine", yearsExperience:  8, licenseNumber: "MCI-TS-10871", bio: "Focuses on holistic primary care and chronic disease management." }),
        docRepo.create({ userId: doc3.id, specialty: "Dermatology",      yearsExperience:  6, licenseNumber: "MCI-TS-11290", bio: "Specializes in clinical and cosmetic dermatology." }),
        docRepo.create({ userId: doc4.id, specialty: "Orthopedics",      yearsExperience: 10, licenseNumber: "MCI-TS-10456", bio: "Sports medicine and joint-care specialist." }),
      ]);

      // ── Patient Profiles
      const patProfileRepo = AppDataSource.getRepository(PatientProfile);
      await patProfileRepo.save([
        patProfileRepo.create({ userId: pat6.id,  medicalRecordNumber: "VS-MRN-9821", dateOfBirth: "2000-03-14", bloodGroup: "O+",  emergencyContactName: "Family Contact", emergencyContactPhone: "+91-90000-10001" }),
        patProfileRepo.create({ userId: pat7.id,  medicalRecordNumber: "VS-MRN-9822", dateOfBirth: "1994-11-02", bloodGroup: "A+",  emergencyContactName: "Family Contact", emergencyContactPhone: "+91-90000-10002" }),
        patProfileRepo.create({ userId: pat8.id,  medicalRecordNumber: "VS-MRN-9823", dateOfBirth: "1998-06-21", bloodGroup: "B+",  emergencyContactName: "Family Contact", emergencyContactPhone: "+91-90000-10003" }),
        patProfileRepo.create({ userId: pat13.id, medicalRecordNumber: "VS-MRN-9828", dateOfBirth: "1991-09-23", bloodGroup: "O+",  emergencyContactName: "Family Contact", emergencyContactPhone: "+91-90000-10008" }),
      ]);

      // ── Patient Directory
      const patDirRepo = AppDataSource.getRepository(PatientDirectory);
      await patDirRepo.save([
        patDirRepo.create({ name: "Sarah Johnson", age: 26, idCode: "VS-MRN-9821", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200", status: "ACTIVE FILE" }),
        patDirRepo.create({ name: "Emily Chen",    age: 32, idCode: "VS-MRN-9822", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200", status: "ACTIVE FILE" }),
        patDirRepo.create({ name: "Arjun Nair",    age: 28, idCode: "VS-MRN-9823", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", status: "ACTIVE FILE" }),
        patDirRepo.create({ name: "Kavya Reddy",   age: 37, idCode: "VS-MRN-9824", avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200", status: "ACTIVE FILE" }),
        patDirRepo.create({ name: "John Doe",      age: 35, idCode: "VS-MRN-9828", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", status: "ACTIVE FILE" }),
      ]);

      // ── Appointments
      const apptRepo = AppDataSource.getRepository(Appointment);
      const savedAppts = await apptRepo.save([
        apptRepo.create({ doctorId: doc1.id, patientId: pat6.id,  appointmentDate: new Date("2026-07-24T09:00:00"), status: "scheduled", reasonForVisit: "Annual cardiac checkup"                        }),
        apptRepo.create({ doctorId: doc1.id, patientId: pat7.id,  appointmentDate: new Date("2026-07-24T10:30:00"), status: "completed", reasonForVisit: "Consultation for chest tightness"              }),
        apptRepo.create({ doctorId: doc1.id, patientId: pat13.id, appointmentDate: new Date("2026-07-24T11:15:00"), status: "cancelled", reasonForVisit: "Follow-up on hypertension"                     }),
        apptRepo.create({ doctorId: doc2.id, patientId: pat8.id,  appointmentDate: new Date("2026-07-25T09:00:00"), status: "scheduled", reasonForVisit: "General wellness check"                        }),
        apptRepo.create({ doctorId: doc2.id, patientId: pat13.id, appointmentDate: new Date("2026-07-20T09:45:00"), status: "completed", reasonForVisit: "Persistent nasal congestion, low-grade fever"  }),
        apptRepo.create({ doctorId: doc3.id, patientId: pat8.id,  appointmentDate: new Date("2026-07-26T10:00:00"), status: "scheduled", reasonForVisit: "Recurring seasonal skin allergy"               }),
        apptRepo.create({ doctorId: doc4.id, patientId: pat13.id, appointmentDate: new Date("2026-07-22T15:00:00"), status: "completed", reasonForVisit: "Knee pain after running"                       }),
      ]);

      // ── Availability Slots
      const slotRepo = AppDataSource.getRepository(AvailabilitySlot);
      await slotRepo.save([
        slotRepo.create({ doctorId: doc1.id, startTime: new Date("2026-07-27T09:00:00"), endTime: new Date("2026-07-27T09:30:00"), isBooked: true  }),
        slotRepo.create({ doctorId: doc1.id, startTime: new Date("2026-07-27T10:30:00"), endTime: new Date("2026-07-27T11:00:00"), isBooked: false }),
        slotRepo.create({ doctorId: doc1.id, startTime: new Date("2026-07-27T14:00:00"), endTime: new Date("2026-07-27T14:30:00"), isBooked: false }),
        slotRepo.create({ doctorId: doc2.id, startTime: new Date("2026-07-27T09:00:00"), endTime: new Date("2026-07-27T09:30:00"), isBooked: false }),
        slotRepo.create({ doctorId: doc2.id, startTime: new Date("2026-07-27T11:15:00"), endTime: new Date("2026-07-27T11:45:00"), isBooked: true  }),
        slotRepo.create({ doctorId: doc3.id, startTime: new Date("2026-07-28T10:00:00"), endTime: new Date("2026-07-28T10:30:00"), isBooked: false }),
        slotRepo.create({ doctorId: doc4.id, startTime: new Date("2026-07-28T15:00:00"), endTime: new Date("2026-07-28T15:30:00"), isBooked: false }),
      ]);

      // ── Medical Records (notes field, recordedAt, integer IDs)
      const recRepo = AppDataSource.getRepository(MedicalRecord);
      await recRepo.save([
        recRepo.create({ patientId: pat7.id,  doctorId: doc1.id, diagnosis: "Acute Sinusitis",               symptoms: "Persistent headache, nasal congestion, low-grade fever.",  notes: "Patient reports symptoms started 5 days ago. Prescribed antibiotics and recommended rest.",               recordedAt: new Date("2026-07-23T10:45:00") }),
        recRepo.create({ patientId: pat8.id,  doctorId: doc3.id, diagnosis: "Seasonal Allergies",            symptoms: "Sneezing, watery itchy eyes.",                             notes: "Symptoms recurring annually during late summer. Advised avoidance of triggers and started antihistamines.", recordedAt: new Date("2026-07-24T09:15:00") }),
        recRepo.create({ patientId: pat6.id,  doctorId: doc1.id, diagnosis: "Annual Wellness Screening",     symptoms: "None reported",                                            notes: "General check. BP 118/75, HR 72bpm. Vitals stable. Vitamin D slightly low (28 ng/mL).",                  recordedAt: new Date("2026-05-15T11:00:00") }),
        recRepo.create({ patientId: pat13.id, doctorId: doc4.id, diagnosis: "Patellar Tendinitis",           symptoms: "Knee pain after running, mild swelling.",                  notes: "Recommended rest, ice, and physiotherapy for 2 weeks.",                                                    recordedAt: new Date("2026-07-22T15:30:00") }),
        recRepo.create({ patientId: pat13.id, doctorId: doc2.id, diagnosis: "Viral Upper Respiratory Infection", symptoms: "Nasal congestion, sore throat, low-grade fever.",     notes: "Supportive care advised; follow up if fever persists beyond 3 days.",                                     recordedAt: new Date("2026-07-20T10:00:00") }),
      ]);

      // ── Prescriptions (medicationName, appointmentId as int)
      const rxRepo = AppDataSource.getRepository(Prescription);
      await rxRepo.save([
        rxRepo.create({ appointmentId: savedAppts[1].id, medicationName: "Amoxicillin", dosage: "500mg",   frequency: "Once daily, morning",       durationDays: 7  }),
        rxRepo.create({ appointmentId: savedAppts[1].id, medicationName: "Lisinopril",  dosage: "10mg",    frequency: "Once daily, morning",       durationDays: 30 }),
        rxRepo.create({ appointmentId: savedAppts[4].id, medicationName: "Loratadine",  dosage: "10mg",    frequency: "Once daily, as needed",     durationDays: 14 }),
        rxRepo.create({ appointmentId: savedAppts[4].id, medicationName: "Vitamin D3",  dosage: "2000IU",  frequency: "Once daily, softgel",       durationDays: 60 }),
        rxRepo.create({ appointmentId: savedAppts[5].id, medicationName: "Atorvastatin",dosage: "20mg",    frequency: "Once daily, before bed",    durationDays: 30 }),
        rxRepo.create({ appointmentId: savedAppts[6].id, medicationName: "Ibuprofen",   dosage: "400mg",   frequency: "Twice daily, after food",   durationDays: 5  }),
      ]);

      // ── Clinical Feed
      const feedRepo = AppDataSource.getRepository(ClinicalFeed);
      await feedRepo.save([
        feedRepo.create({ time: "10:45 AM", text: "Lab results received for Emily Chen. Hematology report ready.",              patientName: "Emily Chen",    type: "lab"         }),
        feedRepo.create({ time: "09:15 AM", text: "Urgent prescription refill request from pharmacy (RX: #44921).",             patientName: null,            type: "urgent"      }),
        feedRepo.create({ time: "08:30 AM", text: "New appointment scheduled: Sarah Johnson → Dr. Rohan Mehta (Jul 27 09:00).",patientName: "Sarah Johnson", type: "appointment" }),
      ]);

      // ── Biometrics
      const bioRepo = AppDataSource.getRepository(Biometric);
      await bioRepo.save([
        bioRepo.create({ patientId: pat6.id,  bloodPressure: "118/76", bloodPressureStatus: "Optimal",  weightLbs: 142, weightChangeLbs: -2, avgDailySteps: 8420, stepGoal: 10000 }),
        bioRepo.create({ patientId: pat7.id,  bloodPressure: "122/80", bloodPressureStatus: "Normal",   weightLbs: 135, weightChangeLbs:  0, avgDailySteps: 6200, stepGoal:  8000 }),
        bioRepo.create({ patientId: pat8.id,  bloodPressure: "115/75", bloodPressureStatus: "Optimal",  weightLbs: 160, weightChangeLbs:  1, avgDailySteps: 5100, stepGoal:  7500 }),
        bioRepo.create({ patientId: pat13.id, bloodPressure: "130/85", bloodPressureStatus: "Elevated", weightLbs: 180, weightChangeLbs: -1, avgDailySteps: 3800, stepGoal:  6000 }),
      ]);

      // ── Payments & Doctor Dues
      const payRepo = AppDataSource.getRepository(Payment);
      await payRepo.save([
        payRepo.create({ userId: doc1.id, type: "due",          amount: 250.00, description: "Monthly Clinic Facility & Maintenance Fee", dueDate: new Date("2026-08-15"), status: "pending" }),
        payRepo.create({ userId: doc1.id, type: "due",          amount: 120.00, description: "Medical License & Malpractice Protection Renewal", dueDate: new Date("2026-08-30"), status: "pending" }),
        payRepo.create({ userId: doc1.id, type: "due",          amount: 75.00,  description: "Annual Telehealth Platform Infrastructure Fee", dueDate: new Date("2026-07-01"), status: "paid" }),
        payRepo.create({ userId: doc2.id, type: "due",          amount: 200.00, description: "General Clinic Administration & EHR Sync Fee", dueDate: new Date("2026-08-10"), status: "pending" }),
        payRepo.create({ userId: pat6.id, type: "consultation", amount: 80.00,  description: "Cardiology Virtual Consultation Fee", status: "paid" }),
        payRepo.create({ userId: pat13.id, type: "prescription", amount: 45.00, description: "Amoxicillin & Loratadine Prescription Order", status: "pending", referenceId: 1 }),
        payRepo.create({ userId: pat13.id, type: "general",      amount: 50.00,  description: "Lab Processing & Diagnostic Co-pay", status: "pending" }),
      ]);

      dbLogger.log("PostgreSQL Seeding complete.");
    }
  } catch (err) {
    console.error("[TypeORM] Error seeding PostgreSQL database:", err);
  }
}
