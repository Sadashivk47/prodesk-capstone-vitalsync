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
    const fullName = `${data.firstName} ${data.lastName}`.trim();
    const email = data.email.toLowerCase();
    const mrn = data.medicalRecordNumber || `VS-MRN-${Math.floor(1000 + Math.random() * 9000)}`;

    const user = this.userRepo.create({
      email,
      name: fullName,
      firstName: data.firstName,
      lastName: data.lastName,
      role: "patient",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      passwordHash: "$2b$10$RnePUeytnMqzTNjxE2jbDu8S6fLHcCdQKRZY86RKO2kjt6Y2sZxmy",
      memberSince: new Date().getFullYear().toString(),
    });
    const savedUser = await this.userRepo.save(user);

    const profile = this.patProfileRepo.create({
      userId: savedUser.id,
      medicalRecordNumber: mrn,
      dateOfBirth: data.dateOfBirth || "1996-05-20",
      bloodGroup: data.bloodGroup || "O+",
      emergencyContactName: data.emergencyContactName || "Emergency Contact",
      emergencyContactPhone: data.emergencyContactPhone || "+1 (555) 000-1122",
    });
    await this.patProfileRepo.save(profile);

    let age = 28;
    if (data.dateOfBirth) {
      const yr = new Date(data.dateOfBirth).getFullYear();
      if (!isNaN(yr)) age = new Date().getFullYear() - yr;
    }

    const dirEntry = this.patDirRepo.create({
      name: fullName,
      age,
      idCode: mrn,
      avatarUrl: user.avatarUrl,
      status: "ACTIVE FILE",
    });
    const savedDir = await this.patDirRepo.save(dirEntry);

    return {
      id: String(savedDir.id),
      name: fullName,
      age,
      idCode: mrn,
      avatarUrl: user.avatarUrl,
      status: "ACTIVE FILE",
    };
  }
}
