import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ConsumptionService } from './consumption.service';

@ApiTags('Consumption')
@Controller('consumption')
export class ConsumptionController {
  constructor(private consumptionService: ConsumptionService) {}

  @Get(':deviceId')
  @ApiParam({ name: 'deviceId', description: 'Device ID' })
  @ApiQuery({ name: 'from', type: String })
  @ApiQuery({ name: 'to', type: String })
  async findByDevice(@Param('deviceId') deviceId: string, @Query('from') from: string, @Query('to') to: string) {
    return this.consumptionService.findByDevice(deviceId, new Date(from), new Date(to));
  }
}