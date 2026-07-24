import { Injectable } from "@nestjs/common";
import { getSafeRepository } from "../config/data-source.js";
import { Biometric } from "../entities/Biometric.js";

@Injectable()
export class BiometricService {
  private bioRepo = getSafeRepository(Biometric);

  async getBiometrics(patientId?: number | string) {
    const pid = patientId ? Number(patientId) : 6;
    let bio = await this.bioRepo.findOne({ where: { patientId: pid } });

    if (!bio) {
      return {
        patientId: String(pid),
        bloodPressure: "118/76",
        bloodPressureStatus: "Optimal",
        weightLbs: 142,
        weightChangeLbs: -2,
        avgDailySteps: 8420,
        stepGoal: 10000,
      };
    }

    return {
      patientId: String(bio.patientId),
      bloodPressure: bio.bloodPressure || "118/76",
      bloodPressureStatus: bio.bloodPressureStatus || "Optimal",
      weightLbs: bio.weightLbs ?? 142,
      weightChangeLbs: bio.weightChangeLbs ?? -2,
      avgDailySteps: bio.avgDailySteps ?? 8420,
      stepGoal: bio.stepGoal ?? 10000,
    };
  }

  async updateBiometrics(patientId: number | string, data: Partial<Biometric>) {
    const pid = Number(patientId);
    let bio = await this.bioRepo.findOne({ where: { patientId: pid } });
    if (!bio) {
      bio = this.bioRepo.create({ patientId: pid, ...data });
    } else {
      Object.assign(bio, data);
    }
    const saved = await this.bioRepo.save(bio);
    return {
      patientId: String(saved.patientId),
      bloodPressure: saved.bloodPressure || "118/76",
      bloodPressureStatus: saved.bloodPressureStatus || "Optimal",
      weightLbs: saved.weightLbs ?? 142,
      weightChangeLbs: saved.weightChangeLbs ?? -2,
      avgDailySteps: saved.avgDailySteps ?? 8420,
      stepGoal: saved.stepGoal ?? 10000,
    };
  }
}
