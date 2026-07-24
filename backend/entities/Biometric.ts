import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User.js";

/**
 * Maps to the `biometrics` table (added to schema).
 *
 * Schema:
 *   id                    SERIAL PRIMARY KEY
 *   patient_id            INT NOT NULL UNIQUE REFERENCES users(id)
 *   blood_pressure        VARCHAR(20)
 *   blood_pressure_status VARCHAR(50)
 *   weight_lbs            INT
 *   weight_change_lbs     INT
 *   avg_daily_steps       INT
 *   step_goal             INT
 */
@Entity("biometrics")
export class Biometric {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "patient_id", type: "int", unique: true })
  patientId!: number;

  @Column({ name: "blood_pressure", type: "varchar", length: 20, nullable: true })
  bloodPressure?: string;

  @Column({ name: "blood_pressure_status", type: "varchar", length: 50, nullable: true })
  bloodPressureStatus?: string;

  @Column({ name: "weight_lbs", type: "int", nullable: true })
  weightLbs?: number;

  @Column({ name: "weight_change_lbs", type: "int", nullable: true })
  weightChangeLbs?: number;

  @Column({ name: "avg_daily_steps", type: "int", nullable: true })
  avgDailySteps?: number;

  @Column({ name: "step_goal", type: "int", nullable: true })
  stepGoal?: number;

  // ── Relations ──────────────────────────────────────────────
  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "patient_id" })
  patient?: User;
}
