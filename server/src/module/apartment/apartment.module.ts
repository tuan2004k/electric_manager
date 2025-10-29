import { Module } from '@nestjs/common';
import { ApartmentController } from './apartment.controller';
import { ApartmentService } from './apartment.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
  controllers: [ApartmentController],
  providers: [ApartmentService],
  exports: [ApartmentService],
})
export class ApartmentModule {}