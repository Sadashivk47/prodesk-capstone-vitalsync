import { Module } from "@nestjs/common";
import { Reflector, APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { HealthController } from "./health.controller.js";
import { NestAuthController } from "./auth.controller.js";
import { NestDoctorController } from "./doctors.controller.js";
import { NestAppointmentController } from "./appointments.controller.js";
import { NestAvailabilityController } from "./availability.controller.js";
import { NestMedicalRecordController } from "./medical-records.controller.js";
import { NestPrescriptionController } from "./prescriptions.controller.js";
import { NestClinicalFeedController } from "./clinical-feed.controller.js";
import { NestBiometricController } from "./biometrics.controller.js";
import { NestAiController } from "./ai.controller.js";
import { NestPaymentController } from "./payments.controller.js";

import { AuthService } from "../services/AuthService.js";
import { UsersService } from "../services/UsersService.js";
import { DoctorService } from "../services/DoctorService.js";
import { AppointmentService } from "../services/AppointmentService.js";
import { AvailabilityService } from "../services/AvailabilityService.js";
import { MedicalRecordService } from "../services/MedicalRecordService.js";
import { PrescriptionService } from "../services/PrescriptionService.js";
import { ClinicalFeedService } from "../services/ClinicalFeedService.js";
import { BiometricService } from "../services/BiometricService.js";
import { AiService } from "../services/AiService.js";
import { PaymentsService } from "../services/PaymentsService.js";
import { JwtStrategy } from "../auth/jwt.strategy.js";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT_SECRET environment variable is required but not set.");
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";

@Module({
  imports: [
    // Rate Limiting
    // Global default: 20 requests per 60 seconds per IP.
    // Individual routes can override this with @Throttle() decorator.
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 20 }]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      global: true,
      secret: jwtSecret,
      signOptions: { expiresIn: jwtExpiresIn as `${number}${"s" | "m" | "h" | "d"}` },
    }),
  ],
  controllers: [
    HealthController,
    NestAuthController,
    NestDoctorController,
    NestAppointmentController,
    NestAvailabilityController,
    NestMedicalRecordController,
    NestPrescriptionController,
    NestClinicalFeedController,
    NestBiometricController,
    NestAiController,
    NestPaymentController,
  ],
  providers: [
    Reflector,
    // Phase 3 — Global Rate-Limit Guard
    // Enforces ThrottlerModule limits on every route automatically.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    JwtStrategy,
    UsersService,
    AuthService,
    DoctorService,
    AppointmentService,
    AvailabilityService,
    MedicalRecordService,
    PrescriptionService,
    ClinicalFeedService,
    BiometricService,
    AiService,
    PaymentsService,
  ],
})
export class AppModule {}
