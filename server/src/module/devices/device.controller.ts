import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard'; // Đường dẫn giả định dựa trên cấu trúc module
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator'; // Đường dẫn giả định dựa trên ví dụ trước

@ApiTags('Devices')
@ApiBearerAuth() // Thêm Bearer Auth cho Swagger docs (vì dùng JWT global)
@Controller('devices')
@UseGuards(JwtAuthGuard, RolesGuard) // Áp dụng guards cho toàn bộ controller (nếu không dùng global; bỏ nếu đã global)
export class DeviceController {
  constructor(private deviceService: DeviceService) {}

  @Get()
  @Roles('ADMIN') // Chỉ admin mới xem danh sách tất cả devices (nếu cần user-specific, thêm logic trong service)
  @ApiResponse({ status: 200, description: 'List devices' })
  async findAll() {
    return this.deviceService.findAll();
  }

  @Post()
  @Roles('USER', 'ADMIN') // User hoặc admin mới tạo device
  @ApiBody({ type: CreateDeviceDto })
  @ApiResponse({ status: 201, description: 'Device created' })
  async create(@Body() body: CreateDeviceDto) {
    return this.deviceService.create(body);
  }
}