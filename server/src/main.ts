import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common'; 
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './common/fillters/http-exception.filter';  

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Smart Energy API')
    .setDescription('IoT-AI Energy Management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('PORT', 3000);
  const logger = new Logger('Bootstrap');
  await app.listen(port);
  logger.log(`App running on: http://localhost:${port}`);
  logger.log(`API Docs: http://localhost:${port}/api`);
}
bootstrap();