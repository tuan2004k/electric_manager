import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Devices')
@ApiBearerAuth() 
@Controller('devices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeviceController {
  constructor(private deviceService: DeviceService) {}

  @Get()
  @Roles('ADMIN') 
  @ApiResponse({ status: 200, description: 'List devices' })
  async findAll() {
    return this.deviceService.findAll();
  }

  @Post()
  @Roles('USER', 'ADMIN') 
  @ApiBody({ type: CreateDeviceDto })
  @ApiResponse({ status: 201, description: 'Device created' })
  async create(@Body() body: CreateDeviceDto) {
    return this.deviceService.create(body);
  }
}