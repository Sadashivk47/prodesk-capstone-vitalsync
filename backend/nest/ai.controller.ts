import { Controller, Post, Get, Body, Param, UseGuards, Inject } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AiService } from "../services/AiService.js";
import { MedicalRecordService } from "../services/MedicalRecordService.js";
import { PrescriptionService } from "../services/PrescriptionService.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { RolesGuard } from "../auth/roles.guard.js";
import { Roles } from "../auth/roles.decorator.js";

/**
 * AI Controller — Phase 2
 *
 * All AI endpoints live HERE on the server, never on the frontend.
 * The Gemini API key is only read server-side — it is never sent to the browser.
 *
 * Architecture:
 *   Browser (Next.js) → POST /api/ai/summarize-history/:patientId → AiService → Gemini
 */
@Controller("api/ai")
@UseGuards(JwtAuthGuard, RolesGuard)
export class NestAiController {
  constructor(
    @Inject(AiService) private readonly aiService: AiService,
    @Inject(MedicalRecordService) private readonly recordService: MedicalRecordService,
    @Inject(PrescriptionService) private readonly prescriptionService: PrescriptionService,
  ) {}

  /**
   * POST /api/ai/summarize-history/:patientId
   *
   * Phase 2 — The core AI feature:
   *   1. Fetches the patient's medical records (via existing service — no duplicate DB queries)
   *   2. Fetches the patient's prescriptions (via existing service)
   *   3. Builds a prompt and sends to Gemini server-side
   *   4. Returns only { summary } — never exposes the raw prompt or key
   *
   * Protected by: JWT auth + doctor-role only
   * Rate limited: 5 requests per 60 seconds (paid call — must not be abused)
   */
  @Post("summarize-history/:patientId")
  @Roles("doctor")
  // Phase 3 — Strict rate limit: 5 AI calls per 60 seconds per IP.
  // This protects against someone scripting thousands of paid Gemini calls.
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async summarizeHistory(@Param("patientId") patientId: string) {
    // Reuse existing services — no new DB queries
    const records = await this.recordService.getRecords(patientId);
    const prescriptions = await this.prescriptionService.getPrescriptions({});

    const patientData = {
      patientId,
      medicalRecords: records.filter((r) => r.patientId === patientId),
      prescriptions: prescriptions,
    };

    return this.aiService.generateClinicalSummary(patientData);
  }

  /**
   * POST /api/ai/clinical-summary (legacy — kept for frontend backward-compatibility)
   * Accepts raw patientData + optional prompt from the request body.
   */
  @Post("clinical-summary")
  @Roles("doctor")
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async clinicalSummary(@Body() body: { patientData: any; prompt?: string }) {
    return this.aiService.generateClinicalSummary(body?.patientData, body?.prompt);
  }
}
