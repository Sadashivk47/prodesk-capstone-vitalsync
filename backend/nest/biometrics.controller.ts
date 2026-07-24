import { Controller, Get, Post, Put, Query, Body, UseGuards, Inject } from "@nestjs/common";
import { BiometricService } from "../services/BiometricService.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";

@Controller("api/biometrics")
@UseGuards(JwtAuthGuard)
export class NestBiometricController {
  constructor(@Inject(BiometricService) private readonly bioService: BiometricService) {}

  @Get()
  async getBiometrics(@Query("patientId") patientId?: string) {
    const pid = patientId || "6";  // default: Sarah Johnson (user id 6)
    return this.bioService.getBiometrics(pid);
  }

  @Put()
  async updateBiometrics(@Body() body: any) {
    const pid = body.patientId || "6";
    return this.bioService.updateBiometrics(pid, body);
  }
}
