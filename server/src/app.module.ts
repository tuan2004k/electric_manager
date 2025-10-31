import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './module/users/user.module';
import { DeviceModule } from './module/devices/device.module';
import { ConsumptionModule } from './module/consumption/consumption.module';
import { AuthModule } from './module/auth/auth.module';
import { AiModule } from './module/ai/ai.module';
import { RecommendationModule } from './module/recommendation/recommendation.module';
import { ApartmentModule } from './module/apartment/apartment.module';
import { MqttTestController } from './mqtt/mqtt-test.controller';
import { DeviceMqttGateway } from './module/devices/mqtt/device-mqtt.gateway';
import { JwtAuthGuard } from './common/guards/jwt.guard'; // 👈 Đảm bảo đường dẫn đúng
import { RolesGuard } from './common/guards/role.guard';   // 👈 Đảm bảo đường dẫn đúng

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    UserModule,
    DeviceModule,
    ConsumptionModule,
    AiModule,
    RecommendationModule,
    ApartmentModule,
  ],
  controllers: [AppController, MqttTestController],
  providers: [
    AppService,
    DeviceMqttGateway,
    // 👇 SỬA LẠI: Dùng useClass thay vì useValue, và tách thành 2 provider
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // 👈 Tách riêng
    },
    {
      provide: APP_GUARD, 
      useClass: RolesGuard,   // 👈 Tách riêng
    },
  ],
})
export class AppModule {}