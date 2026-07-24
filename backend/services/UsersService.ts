import { ConflictException, Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";
import { getSafeRepository } from "../config/data-source.js";
import { User } from "../entities/User.js";
import { DoctorProfile } from "../entities/DoctorProfile.js";
import { PatientProfile } from "../entities/PatientProfile.js";
import { PatientDirectory } from "../entities/PatientDirectory.js";
import { RegisterDto } from "../dto/register.dto.js";

const BCRYPT_ROUNDS = 10;

export type SafeUser = {
  id: string;
  email: string;
  name: string;
  role: "doctor" | "patient";
  title?: string;
  specialty?: string;
  avatarUrl?: string;
  memberSince?: string;
};

@Injectable()
export class UsersService {
  private userRepo = getSafeRepository(User);
  private docRepo = getSafeRepository(DoctorProfile);
  private patRepo = getSafeRepository(PatientProfile);
  private patDirRepo = getSafeRepository(PatientDirectory);

  sanitizeUser(user: User): SafeUser {
    const u = user as any;
    const displayName =
      u.name?.trim() ||
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim() ||
      user.email;

    return {
      id: String(user.id),
      email: user.email,
      name: displayName,
      role: user.role,
      title: u.title,
      specialty: u.specialty,
      avatarUrl: u.avatarUrl,
      memberSince: u.memberSince,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email: email.toLowerCase().trim() } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  /** Password is hashed here — never stored or passed as plaintext beyond this method. */
  async create(dto: RegisterDto): Promise<User> {
    const cleanEmail = dto.email.toLowerCase().trim();
    const existing = await this.findByEmail(cleanEmail);
    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const nameParts = dto.name.trim().split(/\s+/);
    const firstName = nameParts[0] || dto.name;
    const lastName = nameParts.slice(1).join(" ") || "";
    const displayName = dto.name.trim();
    const memberSince = new Date().getFullYear().toString();

    const rawPassword = dto.password && dto.password.trim().length > 0 ? dto.password.trim() : "Password@123";
    const passwordHash = await bcrypt.hash(rawPassword, BCRYPT_ROUNDS);

    const avatarUrl =
      dto.role === "doctor"
        ? "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200"
        : "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200";

    const title =
      dto.role === "doctor"
        ? dto.specialty || "General Practitioner"
        : "Patient Account";

    const user = this.userRepo.create({
      email: cleanEmail,
      passwordHash,
      role: dto.role,
      firstName,
      lastName,
      name: displayName,
      title,
      specialty: dto.role === "doctor" ? dto.specialty || "General Medicine" : undefined,
      avatarUrl,
      memberSince,
    });

    // In-memory fallback has no auto-increment — assign the next id manually
    if (user.id == null) {
      const existing = await this.userRepo.find();
      const maxId = existing.reduce((max: number, u: User) => Math.max(max, Number(u.id) || 0), 0);
      user.id = maxId + 1;
    }

    const savedUser: User = await this.userRepo.save(user);

    if (dto.role === "doctor") {
      const docProfile = this.docRepo.create({
        userId: savedUser.id,
        specialty: dto.specialty || "General Medicine",
        yearsExperience: 5,
        licenseNumber: `MD-${Math.floor(100000 + Math.random() * 900000)}-NY`,
        bio: `Dr. ${displayName} is a dedicated medical specialist.`,
      });
      await this.docRepo.save(docProfile);
    } else {
      const mrn = `VS-MRN-${Math.floor(1000 + Math.random() * 9000)}`;
      const patProfile = this.patRepo.create({
        userId: savedUser.id,
        medicalRecordNumber: mrn,
        dateOfBirth: "1995-01-01",
        bloodGroup: "A+",
        emergencyContactName: "Emergency Contact",
        emergencyContactPhone: "+1 (555) 000-0000",
      });
      await this.patRepo.save(patProfile);

      const dirEntry = this.patDirRepo.create({
        id: String(savedUser.id),
        name: displayName,
        age: 29,
        idCode: mrn,
        avatarUrl,
        status: "ACTIVE FILE",
      });
      await this.patDirRepo.save(dirEntry);
    }

    return savedUser;
  }
}
