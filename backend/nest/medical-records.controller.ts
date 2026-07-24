import { Controller, Get, Post, Query, Body, UseGuards, Inject } from "@nestjs/common";
import { MedicalRecordService } from "../services/MedicalRecordService.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { RolesGuard } from "../auth/roles.guard.js";
import { Roles } from "../auth/roles.decorator.js";

@Controller("api/medical-records")
@UseGuards(JwtAuthGuard, RolesGuard)
export class NestMedicalRecordController {
  constructor(@Inject(MedicalRecordService) private readonly recordService: MedicalRecordService) {}

  @Get()
  async getRecords(@Query("patientId") patientId?: string) {
    return this.recordService.getRecords(patientId);
  }

  @Post()
  @Roles("doctor")
  async createRecord(@Body() body: any) {
    return this.recordService.createRecord(body);
  }
}
