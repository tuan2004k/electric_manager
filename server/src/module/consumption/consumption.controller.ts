import { Controller, Get, Param, Query } from '@nestjs/common';
import { ConsumptionService } from './consumption.service';

@Controller('consumption')
export class ConsumptionController {
  constructor(private consumptionService: ConsumptionService) {}

  @Get(':deviceId')
  async findByDevice(@Param('deviceId') deviceId: string, @Query('from') from: string, @Query('to') to: string) {
    return this.consumptionService.findByDevice(deviceId, new Date(from), new Date(to));
  }
}