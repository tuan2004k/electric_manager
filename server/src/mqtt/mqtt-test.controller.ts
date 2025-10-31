import { Controller, Get, Logger } from '@nestjs/common';
import { DeviceMqttGateway } from '../module/devices/mqtt/device-mqtt.gateway';

@Controller('mqtt-test')
export class MqttTestController {
  private readonly logger = new Logger(MqttTestController.name);

  constructor(private readonly mqttGateway: DeviceMqttGateway) {}

  @Get('status')
  getStatus() {
    this.logger.log('Checking MQTT connection status...');
    const status = this.mqttGateway.getConnectionStatus();
    this.logger.log(`MQTT Status: ${status.status}`);
    return status;
  }

  @Get('health')
  healthCheck() {
    return {
      service: 'MQTT Test Controller',
      status: 'running',
      timestamp: new Date().toISOString()
    };
  }

  // 👇 COMMENT HOẶC XÓA ENDPOINT NÀY
  // @Post('publish-test')
  // async publishTestMessage(@Body() body: { topic: string; message: string }) {
  //   const success = this.mqttGateway.testPublish(body.topic, body.message);
  //   return {
  //     success: success,
  //     message: success ? 'Message published successfully' : 'Failed to publish message',
  //     timestamp: new Date().toISOString(),
  //   };
  // }
}