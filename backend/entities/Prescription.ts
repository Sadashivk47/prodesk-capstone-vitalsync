import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Appointment } from "./Appointment.js";

/**
 * Maps to the `prescriptions` table in the schema.
 *
 * Schema:
 *   id              SERIAL PRIMARY KEY
 *   appointment_id  INT NOT NULL REFERENCES appointments(id)
 *   medication_name VARCHAR(255) NOT NULL
 *   dosage          VARCHAR(100) NOT NULL
 *   frequency       VARCHAR(100) NOT NULL
 *   duration_days   INT NOT NULL
 *   created_at      TIMESTAMP NOT NULL DEFAULT NOW()
 */
@Entity("prescriptions")
export class Prescription {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "appointment_id", type: "int" })
  appointmentId!: number;

  /** Maps to `medication_name` column. */
  @Column({ name: "medication_name", type: "varchar", length: 255 })
  medicationName!: string;

  @Column({ type: "varchar", length: 100 })
  dosage!: string;

  @Column({ type: "varchar", length: 100 })
  frequency!: string;

  @Column({ name: "duration_days", type: "int", default: 7 })
  durationDays!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  // ── Relations ──────────────────────────────────────────────
  @ManyToOne(() => Appointment, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "appointment_id" })
  appointment?: Appointment;
}
