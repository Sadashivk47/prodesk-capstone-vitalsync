import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User.js";

@Entity("doctor_profiles")
export class DoctorProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "user_id", type: "int", unique: true })
  userId!: number;

  @OneToOne(() => User, (user) => user.doctorProfile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ type: "varchar", length: 100 })
  specialty!: string;

  @Column({ name: "years_experience", type: "int", default: 0 })
  yearsExperience!: number;

  @Column({ name: "license_number", type: "varchar", length: 50, nullable: true })
  licenseNumber?: string;

  @Column({ type: "text", nullable: true })
  bio?: string;
}
