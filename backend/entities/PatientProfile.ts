import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User.js";

@Entity("patient_profiles")
export class PatientProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "user_id", type: "int", unique: true })
  userId!: number;

  @OneToOne(() => User, (user) => user.patientProfile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "medical_record_number", type: "varchar", length: 20 })
  medicalRecordNumber!: string;

  @Column({ name: "date_of_birth", type: "varchar", length: 100, nullable: true })
  dateOfBirth!: string;

  @Column({ name: "blood_group", type: "varchar", length: 5, nullable: true })
  bloodGroup?: string;

  @Column({ name: "emergency_contact_name", type: "varchar", length: 150, nullable: true })
  emergencyContactName?: string;

  @Column({ name: "emergency_contact_phone", type: "varchar", length: 20, nullable: true })
  emergencyContactPhone?: string;
}
