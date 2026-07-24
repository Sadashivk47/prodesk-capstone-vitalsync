import { Controller, Get, Post, Query, Body, UseGuards, Inject } from "@nestjs/common";
import { PrescriptionService } from "../services/PrescriptionService.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { RolesGuard } from "../auth/roles.guard.js";
import { Roles } from "../auth/roles.decorator.js";

@Controller("api/prescriptions")
@UseGuards(JwtAuthGuard, RolesGuard)
export class NestPrescriptionController {
  constructor(@Inject(PrescriptionService) private readonly prescriptionService: PrescriptionService) {}

  @Get()
  async getPrescriptions(@Query("appointmentId") appointmentId?: string) {
    return this.prescriptionService.getPrescriptions({ appointmentId: appointmentId ? Number(appointmentId) : undefined });
  }

  @Post()
  @Roles("doctor")
  async createPrescription(@Body() body: any) {
    return this.prescriptionService.createPrescription(body);
  }
}
