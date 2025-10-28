import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ConsumptionService {
  constructor(private prisma: PrismaService, private aiService: AiService) {}

  async findByDevice(deviceId: string, from: Date, to: Date) {
    return this.prisma.consumptionRecord.findMany({
      where: { deviceId, timestamp: { gte: from, lte: to } },
      orderBy: { timestamp: 'asc' },
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async analyzeAllDevices() {
    const devices = await this.prisma.device.findMany();
    for (const device of devices) {
      await this.aiService.detectAnomaly(device.id);
    }
  }
}