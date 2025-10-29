import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ConsumptionService } from './consumption.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator'; 

@ApiTags('Consumption')
@ApiBearerAuth() 
@Controller('consumption')
@UseGuards(JwtAuthGuard, RolesGuard) 
export class ConsumptionController {
  constructor(private consumptionService: ConsumptionService) {}

  @Get(':deviceId')
  @Roles('USER', 'ADMIN') 
  @ApiParam({ name: 'deviceId', description: 'Device ID' })
  @ApiQuery({ name: 'from', type: String })
  @ApiQuery({ name: 'to', type: String })
  async findByDevice(@Param('deviceId') deviceId: string, @Query('from') from: string, @Query('to') to: string) {
    return this.consumptionService.findByDevice(deviceId, new Date(from), new Date(to));
  }
}