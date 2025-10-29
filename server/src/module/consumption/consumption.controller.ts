import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ConsumptionService } from './consumption.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard'; // Đường dẫn giả định dựa trên cấu trúc module
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator'; // Đường dẫn giả định dựa trên ví dụ trước

@ApiTags('Consumption')
@ApiBearerAuth() // Thêm Bearer Auth cho Swagger docs (vì dùng JWT global)
@Controller('consumption')
@UseGuards(JwtAuthGuard, RolesGuard) // Áp dụng guards cho toàn bộ controller (nếu không dùng global; bỏ nếu đã global)
export class ConsumptionController {
  constructor(private consumptionService: ConsumptionService) {}

  @Get(':deviceId')
  @Roles('USER', 'ADMIN') // Chỉ user (owner) hoặc admin mới xem consumption của device
  @ApiParam({ name: 'deviceId', description: 'Device ID' })
  @ApiQuery({ name: 'from', type: String })
  @ApiQuery({ name: 'to', type: String })
  async findByDevice(@Param('deviceId') deviceId: string, @Query('from') from: string, @Query('to') to: string) {
    return this.consumptionService.findByDevice(deviceId, new Date(from), new Date(to));
  }
}