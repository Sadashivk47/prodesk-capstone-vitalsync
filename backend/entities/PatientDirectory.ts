import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";

/**
 * Maps to the `patients_directory` table (added to schema).
 * This is a denormalized view/cache table for the patient directory UI.
 *
 * Schema:
 *   id         SERIAL PRIMARY KEY
 *   name       VARCHAR(255)
 *   age        INT
 *   id_code    VARCHAR(50)
 *   avatar_url TEXT
 *   status     VARCHAR(50) DEFAULT 'ACTIVE FILE'
 */
@Entity("patients_directory")
export class PatientDirectory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  name?: string;

  @Column({ type: "int", nullable: true })
  age?: number;

  @Column({ name: "id_code", type: "varchar", length: 50, nullable: true })
  idCode?: string;

  @Column({ name: "avatar_url", type: "text", nullable: true })
  avatarUrl?: string;

  @Column({ type: "varchar", length: 50, default: "ACTIVE FILE" })
  status!: string;
}
