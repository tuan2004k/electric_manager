import { prisma } from '../lib/prisma';
import { PowerReading } from '@prisma/client';

export class PowerReadingService {
  async createBulk(readings: Array<{
    apartmentId: string;
    deviceId: string;
    currentPowerW: number;  // ← Thay: wattage → currentPowerW
    timestamp: string;
  }>): Promise<PowerReading[]> {
    const data = readings.map(r => ({
      apartmentId: r.apartmentId,
      deviceId: r.deviceId,
      currentPowerW: r.currentPowerW,  // ← Thay: wattage → currentPowerW
      timestamp: new Date(r.timestamp),
    }));
    const result = await prisma.powerReading.createMany({ data });
    return readings.map(r => ({ ...r, id: '' as any }));  // Mock return (createMany không return instances)
  }
}