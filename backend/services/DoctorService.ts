import { Injectable } from "@nestjs/common";
import { getSafeRepository } from "../config/data-source.js";
import { User } from "../entities/User.js";
import { DoctorProfile } from "../entities/DoctorProfile.js";
import { PatientDirectory } from "../entities/PatientDirectory.js";
import { PatientProfile } from "../entities/PatientProfile.js";

@Injectable()
export class DoctorService {
  private userRepo = getSafeRepository(User);
  private docRepo = getSafeRepository(DoctorProfile);
  private patDirRepo = getSafeRepository(PatientDirectory);
  private patProfileRepo = getSafeRepository(PatientProfile);

  async getAllDoctors() {
    return await this.userRepo.find({ where: { role: "doctor" } });
  }

  async getDoctorProfile(userId: string) {
    return await this.docRepo.findOne({ where: { userId: Number(userId) } });
  }

  async getPatientsDirectory() {
    const dirList = await this.patDirRepo.find();
    const patientUsers = await this.userRepo.find({ where: { role: "patient" } });
    const profiles = await this.patProfileRepo.find();

    const mergedMap = new Map<string, any>();

    // Add PatientDirectory entries
    for (const d of dirList) {
      mergedMap.set(String(d.id), {
        id: String(d.id),
        name: d.name || "Patient",
        age: d.age || 30,
        idCode: d.idCode || `#VC-${d.id}`,
        avatarUrl: d.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        status: d.status || "ACTIVE FILE",
      });
    }

    // Add patient users if not present
    for (const u of patientUsers) {
      if (!mergedMap.has(String(u.id))) {
        const prof = profiles.find((p) => String(p.userId) === String(u.id));
        let age = 30;
        if (prof?.dateOfBirth) {
          const yr = new Date(prof.dateOfBirth).getFullYear();
          if (!isNaN(yr)) age = new Date().getFullYear() - yr;
        }

        mergedMap.set(String(u.id), {
          id: String(u.id),
          name: (u as any).name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email,
          age,
          idCode: prof?.medicalRecordNumber || `#VC-${u.id}`,
          avatarUrl: (u as any).avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
          status: "ACTIVE FILE",
        });
      }
    }

    return Array.from(mergedMap.values());
  }

  async getPatientProfile(userId: string) {
    return await this.patProfileRepo.findOne({ where: { userId: Number(userId) } });
  }

  async createPatient(data: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth?: string;
    bloodGroup?: string;
    medicalRecordNumber?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
  }) {
    const firstName = data.firstName?.trim() || "Patient";
    const lastName = data.lastName?.trim() || "User";
    const fullName = `${firstName} ${lastName}`.trim();
    const email = data.email.toLowerCase().trim();
    const mrn = data.medicalRecordNumber?.trim() || `VS-MRN-${Math.floor(1000 + Math.random() * 9000)}`;
    const dob = data.dateOfBirth && data.dateOfBirth.trim().length > 0 ? data.dateOfBirth.trim() : "1996-05-20";
    const avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";

    // 1. Save to users table (Schema columns: id, email, password_hash, role, first_name, last_name)
    const user = this.userRepo.create({
      email,
      passwordHash: "$2b$10$RnePUeytnMqzTNjxE2jbDu8S6fLHcCdQKRZY86RKO2kjt6Y2sZxmy",
      role: "patient",
      firstName,
      lastName,
    });

    // In-memory store fallback check for next ID
    if (user.id == null) {
      const existing = await this.userRepo.find();
      const maxId = existing.reduce((max: number, u: User) => Math.max(max, Number(u.id) || 0), 0);
      user.id = maxId + 1;
    }

    const savedUser = await this.userRepo.save(user);

    // 2. Save to patient_profiles table (Schema columns: user_id, medical_record_number, date_of_birth, blood_group, emergency_contact_name, emergency_contact_phone)
    const profile = this.patProfileRepo.create({
      userId: savedUser.id,
      medicalRecordNumber: mrn,
      dateOfBirth: dob,
      bloodGroup: data.bloodGroup || "O+",
      emergencyContactName: data.emergencyContactName || "Emergency Contact",
      emergencyContactPhone: data.emergencyContactPhone || "+1 (555) 000-1122",
    });
    await this.patProfileRepo.save(profile);

    // 3. Save to patients_directory table (Cache view)
    let age = 28;
    if (dob) {
      const yr = new Date(dob).getFullYear();
      if (!isNaN(yr)) age = new Date().getFullYear() - yr;
    }

    try {
      const dirEntry = this.patDirRepo.create({
        id: savedUser.id,
        name: fullName,
        age,
        idCode: mrn,
        avatarUrl,
        status: "ACTIVE FILE",
      });
      await this.patDirRepo.save(dirEntry);
    } catch (err) {
      console.warn("[DoctorService] Directory cache save notice:", err);
    }

    return {
      id: String(savedUser.id),
      name: fullName,
      age,
      idCode: mrn,
      avatarUrl,
      status: "ACTIVE FILE",
    };
  }
}
