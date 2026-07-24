import { Controller, Get, UseGuards, Inject } from "@nestjs/common";
import { ClinicalFeedService } from "../services/ClinicalFeedService.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { RolesGuard } from "../auth/roles.guard.js";
import { Roles } from "../auth/roles.decorator.js";

@Controller("api/clinical-feed")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("doctor")
export class NestClinicalFeedController {
  constructor(@Inject(ClinicalFeedService) private readonly feedService: ClinicalFeedService) {}

  @Get()
  async getFeed() {
    return this.feedService.getFeed();
  }
}
