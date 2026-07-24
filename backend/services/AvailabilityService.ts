import { Injectable } from "@nestjs/common";
import { getSafeRepository } from "../config/data-source.js";
import { AvailabilitySlot } from "../entities/AvailabilitySlot.js";

@Injectable()
export class AvailabilityService {
  private slotRepo = getSafeRepository(AvailabilitySlot);

  async getSlots(doctorId?: number | string) {
    const where: any = {};
    if (doctorId != null) where.doctorId = Number(doctorId);

    const rawList = await this.slotRepo.find({ where, order: { id: "ASC" } });

    return rawList.map((s: any) => {
      const sTime = s.startTime ? new Date(s.startTime) : new Date();
      const eTime = s.endTime ? new Date(s.endTime) : new Date();

      const formatTime = (d: Date) => d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      const timeRange = s.timeRange || `${formatTime(sTime)} - ${formatTime(eTime)}`;
      const dateStr = s.date || sTime.toISOString().split("T")[0];

      return {
        id: String(s.id),
        doctorId: String(s.doctorId),
        timeRange,
        date: dateStr,
        isBooked: Boolean(s.isBooked),
      };
    });
  }

  async createSlot(data: {
    doctorId?:  number | string;
    startTime?: Date | string;
    endTime?:   Date | string;
    timeRange?: string;
    date?:      string;
    isBooked?:  boolean;
  }) {
    const docId = data.doctorId ? Number(data.doctorId) : 1;

    let sTime = new Date();
    let eTime = new Date(Date.now() + 30 * 60 * 1000);

    if (data.startTime) sTime = new Date(data.startTime);
    if (data.endTime) eTime = new Date(data.endTime);

    const slot = this.slotRepo.create({
      doctorId:  docId,
      startTime: sTime,
      endTime:   eTime,
      isBooked:  data.isBooked ?? false,
    });

    const saved = await this.slotRepo.save(slot);
    const formatTime = (d: Date) => d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    return {
      id: String(saved.id),
      doctorId: String(saved.doctorId),
      timeRange: data.timeRange || `${formatTime(sTime)} - ${formatTime(eTime)}`,
      date: data.date || sTime.toISOString().split("T")[0],
      isBooked: Boolean(saved.isBooked),
    };
  }

  async deleteSlot(id: number | string) {
    return await this.slotRepo.delete(Number(id));
  }
}
