import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { PrismaModule } from '../../prisma/prisma.module';  // <-- sửa lại đường dẫn

@Module({
  imports: [PrismaModule],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
