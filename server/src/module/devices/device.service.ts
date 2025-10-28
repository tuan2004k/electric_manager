import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { DeviceType } from '@prisma/client'; 

@Injectable()
export class DeviceService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.device.findMany({ include: { apartment: true, consumptionRecords: true } });
  }

  async create(data: { name: string; type: DeviceType; macAddress: string; apartmentId: string }) {
    return this.prisma.device.create({ data });
  }
}