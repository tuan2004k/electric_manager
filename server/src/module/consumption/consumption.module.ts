import { Module } from '@nestjs/common';
import { ConsumptionController } from '../consumption/consumption.controller';
import { ConsumptionService } from './consumption.service';
import { AiModule } from '../ai/ai.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [ConsumptionController],
  providers: [ConsumptionService],
  exports: [ConsumptionService],
})
export class ConsumptionModule {}