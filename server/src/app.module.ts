import { Module } from '@nestjs/common';
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
import { MqttTestController } from './mqtt/mqtt-test.controller';
import { DeviceMqttGateway } from './module/devices/mqtt/device-mqtt.gateway'; 
import { ApartmentModule } from './module/apartment/apartment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    UserModule,
    DeviceModule,
    ConsumptionModule,
    AuthModule,
    AiModule,
    RecommendationModule,
    ApartmentModule,
  ],
  controllers: [AppController, MqttTestController],
  providers: [
    AppService,
    DeviceMqttGateway,
  ],
})
export class AppModule {}