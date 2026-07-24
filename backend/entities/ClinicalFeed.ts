import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

/**
 * Maps to the `clinical_feed` table (added to schema).
 *
 * Schema:
 *   id           SERIAL PRIMARY KEY
 *   event_time   VARCHAR(20)
 *   text         TEXT NOT NULL
 *   patient_name VARCHAR(255)
 *   type         VARCHAR(50)
 *   created_at   TIMESTAMP NOT NULL DEFAULT NOW()
 */
@Entity("clinical_feed")
export class ClinicalFeed {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "event_time", type: "varchar", length: 20, nullable: true })
  time?: string;

  @Column({ type: "text" })
  text!: string;

  @Column({ name: "patient_name", type: "varchar", length: 255, nullable: true })
  patientName?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  type?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
