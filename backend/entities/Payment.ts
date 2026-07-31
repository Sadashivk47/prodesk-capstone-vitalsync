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
 * Maps to the `payments` table in the PostgreSQL schema.
 * Supports Doctor dues (maintenance/license) and Patient fees (consultations/prescriptions).
 */
@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "user_id", type: "int" })
  userId!: number;

  /** Values: 'due' | 'consultation' | 'prescription' | 'general' */
  @Column({ type: "varchar", length: 30 })
  type!: string;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: "text" })
  description!: string;

  @Column({ name: "due_date", type: "timestamp", nullable: true })
  dueDate?: Date;

  /** Values: 'pending' | 'paid' | 'failed' */
  @Column({ type: "varchar", length: 20, default: "pending" })
  status!: string;

  @Column({ name: "stripe_session_id", type: "varchar", length: 255, nullable: true })
  stripeSessionId?: string;

  @Column({ name: "reference_id", type: "int", nullable: true })
  referenceId?: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  // ── Relations ──────────────────────────────────────────────
  @ManyToOne(() => User, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "user_id" })
  user?: User;
}
