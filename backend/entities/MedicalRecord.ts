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
 * Maps to the `medical_records` table in the schema.
 *
 * Schema:
 *   id          SERIAL PRIMARY KEY
 *   patient_id  INT NOT NULL REFERENCES users(id)
 *   doctor_id   INT NOT NULL REFERENCES users(id)
 *   diagnosis   TEXT NOT NULL
 *   symptoms    TEXT
 *   notes       TEXT
 *   recorded_at TIMESTAMP NOT NULL DEFAULT NOW()
 */
@Entity("medical_records")
export class MedicalRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "patient_id", type: "int" })
  patientId!: number;

  @Column({ name: "doctor_id", type: "int" })
  doctorId!: number;

  @Column({ type: "text" })
  diagnosis!: string;

  @Column({ type: "text", nullable: true })
  symptoms?: string;

  /** Maps to `notes` column in the schema. */
  @Column({ name: "notes", type: "text", nullable: true })
  notes?: string;

  @CreateDateColumn({ name: "recorded_at", type: "timestamp" })
  recordedAt!: Date;

  // ── Relations ──────────────────────────────────────────────
  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "patient_id" })
  patient?: User;

  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "doctor_id" })
  doctor?: User;
}