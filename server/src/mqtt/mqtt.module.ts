import { Module } from '@nestjs/common';
import { DeviceMqttGateway } from '../module/devices/mqtt/device-mqtt.gateway';
import { MqttTestController } from './mqtt-test.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
  controllers: [MqttTestController],
  providers: [DeviceMqttGateway],
  exports: [DeviceMqttGateway],
})
export class MqttModule {}