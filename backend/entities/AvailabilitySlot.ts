import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.js";

/**
 * Maps to the `availability_slots` table in the schema.
 *
 * Schema:
 *   id         SERIAL PRIMARY KEY
 *   doctor_id  INT NOT NULL REFERENCES users(id)
 *   start_time TIMESTAMP NOT NULL
 *   end_time   TIMESTAMP NOT NULL
 *   is_booked  BOOLEAN NOT NULL DEFAULT FALSE
 *   CHECK (end_time > start_time)
 */
@Entity("availability_slots")
export class AvailabilitySlot {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "doctor_id", type: "int" })
  doctorId!: number;

  @Column({ name: "start_time", type: "timestamp" })
  startTime!: Date;

  @Column({ name: "end_time", type: "timestamp" })
  endTime!: Date;

  @Column({ name: "is_booked", type: "boolean", default: false })
  isBooked!: boolean;

  // ── Relations ──────────────────────────────────────────────
  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "doctor_id" })
  doctor?: User;
}
