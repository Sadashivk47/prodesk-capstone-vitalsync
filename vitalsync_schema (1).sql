-- ============================================================
-- VitalSync — PostgreSQL Schema + Seed Data Dump
-- Tables: users, doctor_profiles, patient_profiles,
--         appointments, medical_records, prescriptions,
--         availability_slots, biometrics,
--         clinical_feed, patients_directory
-- Run this directly in pgAdmin's Query Tool or Neon's SQL editor.
--
-- All seeded accounts use the password: Password@123
-- (real bcrypt hash below — you can actually log in with these
-- once /auth/login is wired up)
-- ============================================================

-- Clean slate (safe to re-run while iterating locally)
DROP TABLE IF EXISTS prescriptions CASCADE;
DROP TABLE IF EXISTS medical_records CASCADE;
DROP TABLE IF EXISTS availability_slots CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS doctor_profiles CASCADE;
DROP TABLE IF EXISTS patient_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS biometrics CASCADE;
DROP TABLE IF EXISTS clinical_feed CASCADE;
DROP TABLE IF EXISTS patients_directory CASCADE;

-- ============================================================
-- users
-- ============================================================
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL CHECK (role IN ('doctor', 'patient')),
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- doctor_profiles (1-to-1 with users where role = 'doctor')
-- Holds doctor-specific data so `users` stays auth-only.
-- ============================================================
CREATE TABLE doctor_profiles (
    id                SERIAL PRIMARY KEY,
    user_id           INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    specialty         VARCHAR(100) NOT NULL,
    years_experience  INT,
    license_number    VARCHAR(50) UNIQUE,
    bio               TEXT
);

-- ============================================================
-- patient_profiles (1-to-1 with users where role = 'patient')
-- Holds patient-specific data — the "26 Years Old", "ID #9821-EC"
-- fields visible on the Medical History Detail screen come from here.
-- ============================================================
CREATE TABLE patient_profiles (
    id                       SERIAL PRIMARY KEY,
    user_id                  INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    medical_record_number    VARCHAR(20) UNIQUE NOT NULL,
    date_of_birth            DATE NOT NULL,
    blood_group              VARCHAR(5),
    emergency_contact_name   VARCHAR(150),
    emergency_contact_phone  VARCHAR(20)
);

-- ============================================================
-- appointments
-- ============================================================
CREATE TABLE appointments (
    id                SERIAL PRIMARY KEY,
    doctor_id         INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    patient_id        INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appointment_date  TIMESTAMP NOT NULL,
    status            VARCHAR(20) NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    reason_for_visit  TEXT,
    created_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appointments_doctor_id  ON appointments(doctor_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);

-- ============================================================
-- prescriptions
-- ============================================================
CREATE TABLE prescriptions (
    id               SERIAL PRIMARY KEY,
    appointment_id   INT NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
    medication_name  VARCHAR(255) NOT NULL,
    dosage           VARCHAR(100) NOT NULL,
    frequency        VARCHAR(100) NOT NULL,
    duration_days    INT NOT NULL,
    created_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_prescriptions_appointment_id ON prescriptions(appointment_id);

-- ============================================================
-- medical_records
-- ============================================================
CREATE TABLE medical_records (
    id          SERIAL PRIMARY KEY,
    patient_id  INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_id   INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    diagnosis   TEXT NOT NULL,
    symptoms    TEXT,
    notes       TEXT,
    recorded_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_medical_records_patient_id ON medical_records(patient_id);
CREATE INDEX idx_medical_records_doctor_id  ON medical_records(doctor_id);

-- ============================================================
-- availability_slots
-- ============================================================
CREATE TABLE availability_slots (
    id         SERIAL PRIMARY KEY,
    doctor_id  INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time   TIMESTAMP NOT NULL,
    is_booked  BOOLEAN NOT NULL DEFAULT FALSE,
    CHECK (end_time > start_time)
);

CREATE INDEX idx_availability_slots_doctor_id ON availability_slots(doctor_id);

-- ============================================================
-- SEED DATA
-- Password for every seeded account below: Password@123
-- ============================================================

-- ---------- Doctors (ids 1-5) ----------
INSERT INTO users (email, password_hash, role, first_name, last_name) VALUES
('sarah.miller@vitalsync.dev',   '$2b$10$RnePUeytnMqzTNjxE2jbDu8S6fLHcCdQKRZY86RKO2kjt6Y2sZxmy', 'doctor', 'Sarah',   'Miller'),   -- Cardiology
('rohan.mehta@vitalsync.dev',    '$2b$10$RnePUeytnMqzTNjxE2jbDu8S6fLHcCdQKRZY86RKO2kjt6Y2sZxmy', 'doctor', 'Rohan',   'Mehta'),    -- General Medicine
('ananya.krishnan@vitalsync.dev','$2b$10$RnePUeytnMqzTNjxE2jbDu8S6fLHcCdQKRZY86RKO2kjt6Y2sZxmy', 'doctor', 'Ananya',  'Krishnan'), -- Dermatology
('vikram.rao@vitalsync.dev',     '$2b$10$RnePUeytnMqzTNjxE2jbDu8S6fLHcCdQKRZY86RKO2kjt6Y2sZxmy', 'doctor', 'Vikram',  'Rao'),      -- Orthopedics
('priya.desai@vitalsync.dev',    '$2b$10$RnePUeytnMqzTNjxE2jbDu8S6fLHcCdQKRZY86RKO2kjt6Y2sZxmy', 'doctor', 'Priya',   'Desai');    -- Pediatrics

-- ---------- Patients (ids 6-13) ----------
INSERT INTO users (email, password_hash, role, first_name, last_name) VALUES
('sarah.johnson@vitalsync.dev', '$2b$10$RnePUeytnMqzTNjxE2jbDu8S6fLHcCdQKRZY86RKO2kjt6Y2sZxmy', 'patient', 'Sarah',   'Johnson'),
('emily.chen@vitalsync.dev',    '$2b$10$RnePUeytnMqzTNjxE2jbDu8S6fLHcCdQKRZY86RKO2kjt6Y2sZxmy', 'patient', 'Emily',   'Chen'),
('arjun.nair@vitalsync.dev',    '$2b$10$RnePUeytnMqzTNjxE2jbDu8S6fLHcCdQKRZY86RKO2kjt6Y2sZxmy', 'patient', 'Arjun',   'Nair'),
('kavya.reddy@vitalsync.dev',   '$2b$10$RnePUeytnMqzTNjxE2jbDu8S6fLHcCdQKRZY86RKO2kjt6Y2sZxmy', 'patient', 'Kavya',   'Reddy'),
('rahul.iyer@vitalsync.dev',    '$2b$10$RnePUeytnMqzTNjxE2jbDu8S6fLHcCdQKRZY86RKO2kjt6Y2sZxmy', 'patient', 'Rahul',   'Iyer'),
('meera.pillai@vitalsync.dev',  '$2b$10$RnePUeytnMqzTNjxE2jbDu8S6fLHcCdQKRZY86RKO2kjt6Y2sZxmy', 'patient', 'Meera',   'Pillai'),
('aditya.sharma@vitalsync.dev', '$2b$10$RnePUeytnMqzTNjxE2jbDu8S6fLHcCdQKRZY86RKO2kjt6Y2sZxmy', 'patient', 'Aditya',  'Sharma'),
('john.doe@vitalsync.dev',      '$2b$10$RnePUeytnMqzTNjxE2jbDu8S6fLHcCdQKRZY86RKO2kjt6Y2sZxmy', 'patient', 'John',    'Doe');

-- ---------- Doctor profiles (doctors are users 1-5) ----------
INSERT INTO doctor_profiles (user_id, specialty, years_experience, license_number, bio) VALUES
(1, 'Cardiology',         12, 'MCI-TS-10234', 'Lead Cardiologist specializing in preventive cardiac care.'),
(2, 'General Medicine',    8, 'MCI-TS-10871', 'Focuses on holistic primary care and chronic disease management.'),
(3, 'Dermatology',         6, 'MCI-TS-11290', 'Specializes in clinical and cosmetic dermatology.'),
(4, 'Orthopedics',        10, 'MCI-TS-10456', 'Sports medicine and joint-care specialist.'),
(5, 'Pediatrics',          9, 'MCI-TS-10998', 'Focuses on child wellness and developmental care.');

-- ---------- Patient profiles (patients are users 6-13) ----------
INSERT INTO patient_profiles (user_id, medical_record_number, date_of_birth, blood_group, emergency_contact_name, emergency_contact_phone) VALUES
(6,  'VS-MRN-9821', '2000-03-14', 'O+',  'Family Contact', '+91-90000-10001'),
(7,  'VS-MRN-9822', '1994-11-02', 'A+',  'Family Contact', '+91-90000-10002'),
(8,  'VS-MRN-9823', '1998-06-21', 'B+',  'Family Contact', '+91-90000-10003'),
(9,  'VS-MRN-9824', '1989-01-09', 'AB+', 'Family Contact', '+91-90000-10004'),
(10, 'VS-MRN-9825', '1996-08-30', 'O-',  'Family Contact', '+91-90000-10005'),
(11, 'VS-MRN-9826', '2016-04-17', 'A-',  'Family Contact', '+91-90000-10006'),
(12, 'VS-MRN-9827', '1975-12-05', 'B-',  'Family Contact', '+91-90000-10007'),
(13, 'VS-MRN-9828', '1991-09-23', 'O+',  'Family Contact', '+91-90000-10008');

-- ---------- Availability slots for doctors ----------
INSERT INTO availability_slots (doctor_id, start_time, end_time, is_booked) VALUES
(1, '2026-07-27 09:00', '2026-07-27 09:30', TRUE),
(1, '2026-07-27 10:30', '2026-07-27 11:00', FALSE),
(1, '2026-07-27 14:00', '2026-07-27 14:30', FALSE),
(2, '2026-07-27 09:00', '2026-07-27 09:30', FALSE),
(2, '2026-07-27 11:15', '2026-07-27 11:45', TRUE),
(3, '2026-07-28 10:00', '2026-07-28 10:30', FALSE),
(4, '2026-07-28 15:00', '2026-07-28 15:30', FALSE),
(5, '2026-07-29 09:30', '2026-07-29 10:00', FALSE);

-- ---------- Appointments ----------
INSERT INTO appointments (id, doctor_id, patient_id, appointment_date, status, reason_for_visit) VALUES
(1, 1, 6,  '2026-07-24 09:00', 'scheduled', 'Annual cardiac checkup'),
(2, 1, 7,  '2026-07-24 10:30', 'completed', 'Consultation for chest tightness'),
(3, 1, 12, '2026-07-24 11:15', 'cancelled', 'Follow-up on hypertension'),
(4, 2, 9,  '2026-07-25 09:00', 'scheduled', 'General wellness check'),
(5, 2, 13, '2026-07-20 09:45', 'completed', 'Persistent nasal congestion, low-grade fever'),
(6, 3, 8,  '2026-07-26 10:00', 'scheduled', 'Recurring seasonal skin allergy'),
(7, 4, 10, '2026-07-22 15:00', 'completed', 'Knee pain after running'),
(8, 5, 11, '2026-07-23 09:30', 'scheduled', 'Child wellness visit');

-- ---------- Medical records ----------
INSERT INTO medical_records (patient_id, doctor_id, diagnosis, symptoms, notes, recorded_at) VALUES
(7,  1, 'Acute Sinusitis',            'Persistent headache, nasal congestion, low-grade fever', 'Patient reports symptoms started 5 days ago. Prescribed antibiotics and recommended rest.', '2026-07-23 10:45'),
(8,  3, 'Seasonal Allergies',         'Sneezing, watery itchy eyes',                             'Symptoms recurring annually during late summer. Advised avoidance of triggers and started antihistamines.', '2026-07-24 09:15'),
(6,  1, 'Annual Wellness Screening',  'None reported',                                           'General check. BP 118/75, HR 72bpm. Vitals stable. All lab values within normal range. Vitamin D slightly low (28 ng/mL).', '2026-05-15 11:00'),
(10, 4, 'Patellar Tendinitis',        'Knee pain after running, mild swelling',                  'Recommended rest, ice, and physiotherapy for 2 weeks.', '2026-07-22 15:30'),
(13, 2, 'Viral Upper Respiratory Infection', 'Nasal congestion, sore throat, low-grade fever',   'Supportive care advised; follow up if fever persists beyond 3 days.', '2026-07-20 10:00');

-- ---------- Prescriptions ----------
INSERT INTO prescriptions (appointment_id, medication_name, dosage, frequency, duration_days) VALUES
(2, 'Amoxicillin',    '500mg', 'Once daily, morning',  7),
(2, 'Lisinopril',     '10mg',  'Once daily, morning',  30),
(5, 'Loratadine',     '10mg',  'Once daily, as needed', 14),
(5, 'Vitamin D3',     '2000IU','Once daily, softgel',   60),
(6, 'Atorvastatin',   '20mg',  'Once daily, before bed', 30),
(7, 'Ibuprofen',      '400mg', 'Twice daily, after food', 5);

-- Reset the id sequences so future inserts continue correctly after the seed data above
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('doctor_profiles_id_seq', (SELECT MAX(id) FROM doctor_profiles));
SELECT setval('patient_profiles_id_seq', (SELECT MAX(id) FROM patient_profiles));
SELECT setval('appointments_id_seq', (SELECT MAX(id) FROM appointments));
SELECT setval('prescriptions_id_seq', (SELECT MAX(id) FROM prescriptions));
SELECT setval('medical_records_id_seq', (SELECT MAX(id) FROM medical_records));
SELECT setval('availability_slots_id_seq', (SELECT MAX(id) FROM availability_slots));

-- ============================================================
-- biometrics
-- Stores patient vitals/biometric readings (1-to-1 with a patient user).
-- ============================================================
CREATE TABLE biometrics (
    id                    SERIAL PRIMARY KEY,
    patient_id            INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    blood_pressure        VARCHAR(20),
    blood_pressure_status VARCHAR(50),
    weight_lbs            INT,
    weight_change_lbs     INT,
    avg_daily_steps       INT,
    step_goal             INT
);

CREATE INDEX idx_biometrics_patient_id ON biometrics(patient_id);

-- ============================================================
-- clinical_feed
-- Denormalized activity-feed events shown on the doctor dashboard.
-- ============================================================
CREATE TABLE clinical_feed (
    id           SERIAL PRIMARY KEY,
    event_time   VARCHAR(20),
    text         TEXT NOT NULL,
    patient_name VARCHAR(255),
    type         VARCHAR(50),
    created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- patients_directory
-- Denormalized listing table for the doctor's patient directory UI.
-- ============================================================
CREATE TABLE patients_directory (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255),
    age        INT,
    id_code    VARCHAR(50),
    avatar_url TEXT,
    status     VARCHAR(50) NOT NULL DEFAULT 'ACTIVE FILE'
);

-- ---------- Biometrics seed (patient users 6-13 = ids 6-13) ----------
INSERT INTO biometrics (patient_id, blood_pressure, blood_pressure_status, weight_lbs, weight_change_lbs, avg_daily_steps, step_goal) VALUES
(6,  '118/76', 'Optimal',  142, -2, 8420, 10000),
(7,  '122/80', 'Normal',   135,  0, 6200, 8000),
(8,  '115/75', 'Optimal',  160,  1, 5100, 7500),
(9,  '130/85', 'Elevated', 180, -1, 3800, 6000),
(10, '120/78', 'Normal',   155,  2, 9100, 10000);

-- ---------- Clinical feed seed ----------
INSERT INTO clinical_feed (event_time, text, patient_name, type) VALUES
('10:45 AM', 'Lab results received for Emily Chen. Hematology report ready.',             'Emily Chen', 'lab'),
('09:15 AM', 'Urgent prescription refill request from pharmacy (RX: #44921).',            NULL,         'urgent'),
('08:30 AM', 'New appointment scheduled: Sarah Johnson → Dr. Rohan Mehta (Jul 27 09:00).','Sarah Johnson','appointment');

-- ---------- Patients directory seed (mirrors patient users 6-13) ----------
INSERT INTO patients_directory (name, age, id_code, avatar_url, status) VALUES
('Sarah Johnson', 26, 'VS-MRN-9821', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', 'ACTIVE FILE'),
('Emily Chen',    32, 'VS-MRN-9822', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', 'ACTIVE FILE'),
('Arjun Nair',    28, 'VS-MRN-9823', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', 'ACTIVE FILE'),
('Kavya Reddy',   37, 'VS-MRN-9824', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', 'ACTIVE FILE'),
('Rahul Iyer',    30, 'VS-MRN-9825', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', 'ACTIVE FILE'),
('Meera Pillai',  10, 'VS-MRN-9826', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', 'ACTIVE FILE'),
('Aditya Sharma', 51, 'VS-MRN-9827', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', 'ACTIVE FILE'),
('John Doe',      35, 'VS-MRN-9828', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', 'ACTIVE FILE');

-- Reset new sequences
SELECT setval('biometrics_id_seq',        (SELECT MAX(id) FROM biometrics));
SELECT setval('clinical_feed_id_seq',     (SELECT MAX(id) FROM clinical_feed));
SELECT setval('patients_directory_id_seq',(SELECT MAX(id) FROM patients_directory));
