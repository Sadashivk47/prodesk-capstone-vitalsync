import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
} from "typeorm";
import { DoctorProfile } from "./DoctorProfile.js";
import { PatientProfile } from "./PatientProfile.js";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ name: "password_hash", type: "varchar", length: 255 })
  passwordHash!: string;

  @Column({ type: "varchar", length: 20 })
  role!: "doctor" | "patient";

  @Column({ name: "first_name", type: "varchar", length: 100 })
  firstName!: string;

  @Column({ name: "last_name", type: "varchar", length: 100 })
  lastName!: string;

  // ✅ Relations (safe to keep)
  @OneToOne(() => DoctorProfile, (profile) => profile.user, { nullable: true })
  doctorProfile?: DoctorProfile;

  @OneToOne(() => PatientProfile, (profile) => profile.user, { nullable: true })
  patientProfile?: PatientProfile;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  // ✅ Computed field (NOT stored in DB)
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}