import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';


@ApiTags('Devices')
@Controller('devices')
export class DeviceController {
  constructor(private deviceService: DeviceService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'List devices' })
  async findAll() {
    return this.deviceService.findAll();
  }

  @Post()
  @ApiBody({ type: CreateDeviceDto })
  @ApiResponse({ status: 201, description: 'Device created' })
  async create(@Body() body: CreateDeviceDto) {
    return this.deviceService.create(body);
  }
}