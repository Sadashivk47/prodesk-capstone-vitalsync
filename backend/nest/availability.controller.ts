import { Controller, Get, Post, Delete, Query, Param, Body, UseGuards, Inject } from "@nestjs/common";
import { AvailabilityService } from "../services/AvailabilityService.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { RolesGuard } from "../auth/roles.guard.js";
import { Roles } from "../auth/roles.decorator.js";

@Controller("api/availability")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("doctor")
export class NestAvailabilityController {
  constructor(@Inject(AvailabilityService) private readonly availabilityService: AvailabilityService) {}

  @Get()
  async getSlots(@Query("doctorId") doctorId?: string) {
    return this.availabilityService.getSlots(doctorId);
  }

  @Post()
  async createSlot(@Body() body: any) {
    return this.availabilityService.createSlot(body);
  }

  @Delete(":id")
  async deleteSlot(@Param("id") id: string) {
    await this.availabilityService.deleteSlot(id);
    return { success: true };
  }
}
