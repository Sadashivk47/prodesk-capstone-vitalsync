import { Injectable } from "@nestjs/common";
import { getSafeRepository } from "../config/data-source.js";
import { Prescription } from "../entities/Prescription.js";
import { Appointment } from "../entities/Appointment.js";
import { User } from "../entities/User.js";

@Injectable()
export class PrescriptionService {
  private rxRepo = getSafeRepository(Prescription);
  private apptRepo = getSafeRepository(Appointment);
  private userRepo = getSafeRepository(User);

  async getPrescriptions(filters: { appointmentId?: number | string }) {
    const where: any = {};
    if (filters.appointmentId != null) where.appointmentId = Number(filters.appointmentId);

    const rawList = await this.rxRepo.find({ where, order: { id: "DESC" } });
    const appts = await this.apptRepo.find();
    const users = await this.userRepo.find();

    return rawList.map((rx: any) => {
      const appt = appts.find((a: any) => a.id === Number(rx.appointmentId));
      const patient = appt ? users.find((u: any) => u.id === Number(appt.patientId)) : null;
      const pName = patient ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim() : "Sarah Johnson";

      return {
        id: String(rx.id),
        appointmentId: String(rx.appointmentId),
        patientName: pName,
        drugName: rx.medicationName || rx.drugName || "Amoxicillin 500mg",
        dosage: rx.dosage || "1 tablet",
        frequency: rx.frequency || "Once daily",
        timing: rx.timing || "Morning",
        refillsLeft: rx.refillsLeft ?? 2,
        status: rx.status || "Active",
        instructions: rx.instructions || `Take ${rx.dosage || '1 tablet'} ${rx.frequency || 'daily'}.`,
      };
    });
  }

  async createPrescription(data: {
    appointmentId?: number | string;
    medicationName?: string;
    drugName?:       string;
    dosage?:         string;
    frequency?:      string;
    durationDays?:  number;
    patientName?:    string;
    timing?:         string;
    refillsLeft?:    number;
    instructions?:   string;
  }) {
    const apptId = data.appointmentId ? Number(data.appointmentId) : 1;
    const medName = data.medicationName || data.drugName || "Medication";

    const rx = this.rxRepo.create({
      appointmentId:  apptId,
      medicationName: medName,
      dosage:         data.dosage || "10mg",
      frequency:      data.frequency || "Once daily",
      durationDays:   data.durationDays ?? 7,
    });

    const saved = await this.rxRepo.save(rx);

    return {
      id: String(saved.id),
      appointmentId: String(saved.appointmentId),
      patientName: data.patientName || "Sarah Johnson",
      drugName: saved.medicationName,
      dosage: saved.dosage,
      frequency: saved.frequency,
      timing: data.timing || "Morning",
      refillsLeft: data.refillsLeft ?? 2,
      status: "Active",
      instructions: data.instructions || `Take ${saved.dosage} ${saved.frequency}.`,
    };
  }
}
