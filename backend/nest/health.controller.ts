import { Controller, Get } from "@nestjs/common";
import { AppDataSource } from "../config/data-source.js";

@Controller("api/health")
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: "ok",
      framework: "NestJS Framework (NestFactory)",
      service: "VitalSync NestJS Healthcare Platform Backend",
      timestamp: new Date().toISOString(),
      typeormInitialized: AppDataSource.isInitialized,
    };
  }
}
