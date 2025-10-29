import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { DeviceType } from '@prisma/client';
import { CreateDeviceDto } from './dto/create-device.dto';

@Injectable()
export class DeviceService {
  constructor(private prisma: PrismaService) { }


  async findAll() {
    return this.prisma.device.findMany({ include: { apartment: true, consumptionRecords: true } });
  }

  async create(data: CreateDeviceDto) {
    return this.prisma.device.create({ data });
  }
   async findByUser(userId: string) {
    return this.prisma.device.findMany({
      where: {
        apartment: {
          userId,  // Chỉ devices của apartments thuộc user
        },
      },
      include: { apartment: true },
    });
  }
}