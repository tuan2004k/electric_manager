import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// import * as tf from '@tensorflow/tfjs-node';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async detectAnomaly(deviceId: string) {
    const records = await this.prisma.consumptionRecord.findMany({
      where: { deviceId },
      orderBy: { timestamp: 'desc' },
      take: 24,
    });
    if (records.length < 2) return;

    const powers = records.map(r => r.power);
    const avg = powers.reduce((a, b) => a + b, 0) / powers.length;
    const latest = powers[0];

    if (latest > avg * 1.5) {
      await this.prisma.anomaly.create({
        data: { deviceId, type: 'SPIKE', description: 'Power spike detected', severity: 7 },
      });
    }
  }

 async predictSavings(deviceId: string) {
  const totalEnergy = await this.prisma.consumptionRecord.aggregate({
    where: { deviceId },
    _sum: { energy: true },
  });
  // Fix: Kiểm tra null
  const energy = totalEnergy._sum.energy || 0;
  return energy * 0.85;  // Giả sử giảm 15%
}
}