import { Controller, Get, Post, Param, Body, HttpException, HttpStatus, UseGuards, Inject } from "@nestjs/common";
import { DoctorService } from "../services/DoctorService.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { RolesGuard } from "../auth/roles.guard.js";
import { Roles } from "../auth/roles.decorator.js";

@Controller("api")
export class NestDoctorController {
  constructor(@Inject(DoctorService) private readonly doctorService: DoctorService) {}

  @Get("doctors")
  async getDoctors() {
    return this.doctorService.getAllDoctors();
  }

  @Get("doctors/profile/:userId")
  async getDoctorProfile(@Param("userId") userId: string) {
    const profile = await this.doctorService.getDoctorProfile(userId);
    if (!profile) {
      throw new HttpException({ error: "Doctor profile not found" }, HttpStatus.NOT_FOUND);
    }
    return profile;
  }

  @Get("patients")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("doctor")
  async getPatients() {
    return this.doctorService.getPatientsDirectory();
  }

  @Get("patients/directory")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("doctor")
  async getPatientsDirectory() {
    return this.doctorService.getPatientsDirectory();
  }

  @Post("patients")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("doctor")
  async createPatient(@Body() body: any) {
    const { firstName, lastName, email, dateOfBirth, bloodGroup, medicalRecordNumber, emergencyContactName, emergencyContactPhone } = body;
    if (!firstName || !lastName || !email) {
      throw new HttpException({ error: "First name, last name, and email are required." }, HttpStatus.BAD_REQUEST);
    }
    return this.doctorService.createPatient({
      firstName,
      lastName,
      email,
      dateOfBirth,
      bloodGroup,
      medicalRecordNumber,
      emergencyContactName,
      emergencyContactPhone,
    });
  }

  @Get("patients/profile/:userId")
  @UseGuards(JwtAuthGuard)
  async getPatientProfile(@Param("userId") userId: string) {
    const profile = await this.doctorService.getPatientProfile(userId);
    if (!profile) {
      throw new HttpException({ error: "Patient profile not found" }, HttpStatus.NOT_FOUND);
    }
    return profile;
  }
}
