import { Controller, Get, Post, Body } from '@nestjs/common';
import { DeviceService } from './device.service';
import type { DeviceType } from '@prisma/client';

@Controller('devices')
export class DeviceController {
  constructor(private deviceService: DeviceService) {}

  @Get()
  async findAll() {
    return this.deviceService.findAll();
  }

  @Post()
  async create(@Body() body: { name: string; type: string; macAddress: string; apartmentId: string }) {
    const data = {
      ...body,
      type: body.type as DeviceType,  
    };
    return this.deviceService.create(data);
  }
}