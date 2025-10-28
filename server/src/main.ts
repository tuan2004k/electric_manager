import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  const port = process.env.PORT || 3001; // 👈 ĐỔI THÀNH 3001
  await app.listen(port);
  
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`🔍 MQTT Test URLs:`);
  logger.log(`   http://localhost:${port}/mqtt-test/health`);
  logger.log(`   http://localhost:${port}/mqtt-test/status`);
}

bootstrap();