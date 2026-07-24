import { Controller, Get, Post, Put, Patch, Delete, Query, Param, Body, UseGuards, Inject } from "@nestjs/common";
import { AppointmentService } from "../services/AppointmentService.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";

@Controller("api/appointments")
@UseGuards(JwtAuthGuard)
export class NestAppointmentController {
  constructor(@Inject(AppointmentService) private readonly apptService: AppointmentService) {}

  @Get()
  async getAppointments(@Query("doctorId") doctorId?: string, @Query("patientId") patientId?: string) {
    return this.apptService.getAppointments({ doctorId, patientId });
  }

  @Post()
  async createAppointment(@Body() body: any) {
    return this.apptService.createAppointment(body);
  }

  /** PATCH /api/appointments/:id — frontend sends { status } to update appointment status */
  @Patch(":id")
  async patchAppointment(@Param("id") id: string, @Body("status") status: string) {
    return this.apptService.updateStatus(id, status);
  }

  /** PUT /api/appointments/:id/status — legacy alias */
  @Put(":id/status")
  async updateStatus(@Param("id") id: string, @Body("status") status: string) {
    return this.apptService.updateStatus(id, status);
  }

  @Delete(":id")
  async deleteAppointment(@Param("id") id: string) {
    await this.apptService.deleteAppointment(id);
    return { success: true };
  }
}
