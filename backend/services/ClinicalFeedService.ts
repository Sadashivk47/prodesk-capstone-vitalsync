import { Injectable } from "@nestjs/common";
import { getSafeRepository } from "../config/data-source.js";
import { ClinicalFeed } from "../entities/ClinicalFeed.js";

@Injectable()
export class ClinicalFeedService {
  private feedRepo = getSafeRepository(ClinicalFeed);

  async getFeed() {
    const list = await this.feedRepo.find({ order: { id: "ASC" } });
    return list.map((item: any) => ({
      id: String(item.id),
      time: item.time || "10:00 AM",
      text: item.text || "Clinical update received.",
      patientName: item.patientName || undefined,
      type: item.type || "lab",
    }));
  }
}
