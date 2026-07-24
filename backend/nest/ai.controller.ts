import { Controller, Post, Body, UseGuards, Inject } from "@nestjs/common";
import { AiService } from "../services/AiService.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";

@Controller("api/ai")
@UseGuards(JwtAuthGuard)
export class NestAiController {
  constructor(@Inject(AiService) private readonly aiService: AiService) {}

  @Post("clinical-summary")
  async clinicalSummary(@Body() body: { patientData: any; prompt?: string }) {
    return this.aiService.generateClinicalSummary(body?.patientData, body?.prompt);
  }
}
