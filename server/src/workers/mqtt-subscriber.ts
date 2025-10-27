import 'dotenv/config';
import { MqttService } from '@/services/mqtt.service'; // Adjust path nếu cần
import { mqttConfig } from '@/config/mqtt.config';
import { parseMqttPayload } from '@/lib/utills'; // Giả sử utils.ts có method này


async function startMqttSubscriber() {
  console.log('Broker URL from config:', mqttConfig.brokerUrl);
  console.log('Starting MQTT subscriber...');
  const mqttService = new MqttService();

  try {
    // Subscribe power readings (wildcard cho apartment/device)
    await mqttService.subscribe(mqttConfig.topics.powerReadings, async (topic, message) => {
      console.log(`Received message on topic: ${topic}`);
      const payload: any = parseMqttPayload(message.toString());
      console.log('Payload:', payload);
      if (payload.type === 'power-reading') {
        await mqttService.handlePowerReading({ topic, payload });
        console.log('Handled power reading successfully');
      }
    });

    // Subscribe device status
    await mqttService.subscribe(mqttConfig.topics.deviceStatus, async (topic, message) => {
      console.log(`Status update on topic: ${topic}`);
      const payload: any = parseMqttPayload(message.toString());
      if (payload.type === 'status-update') {
        await mqttService.handleDeviceStatus({ topic, payload });
        console.log('Handled status update successfully');
      }
    });

    console.log('MQTT subscriber started and listening...');
  } catch (error) {
    console.error('Error starting subscriber:', error);
  }
}

startMqttSubscriber().catch(console.error);