import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.js";

/**
 * Maps to the `appointments` table in the schema.
 *
 * Schema:
 *   id               SERIAL PRIMARY KEY
 *   doctor_id        INT NOT NULL REFERENCES users(id)
 *   patient_id       INT NOT NULL REFERENCES users(id)
 *   appointment_date TIMESTAMP NOT NULL
 *   status           VARCHAR(20) CHECK (status IN ('scheduled','completed','cancelled'))
 *   reason_for_visit TEXT
 *   created_at       TIMESTAMP NOT NULL DEFAULT NOW()
 */
@Entity("appointments")
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "doctor_id", type: "int" })
  doctorId!: number;

  @Column({ name: "patient_id", type: "int" })
  patientId!: number;

  @Column({ name: "appointment_date", type: "timestamp" })
  appointmentDate!: Date;

  /** Values: 'scheduled' | 'completed' | 'cancelled' */
  @Column({ type: "varchar", length: 20, default: "scheduled" })
  status!: string;

  @Column({ name: "reason_for_visit", type: "text", nullable: true })
  reasonForVisit?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  // ── Relations ──────────────────────────────────────────────
  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "doctor_id" })
  doctor?: User;

  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "patient_id" })
  patient?: User;
}
