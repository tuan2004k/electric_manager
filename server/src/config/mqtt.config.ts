import { MqttConfig } from '../types/mqtt.types';
import { env } from './env';  // Import env parsed (throw nếu MQTT_BROKER_URL missing)

export const mqttConfig: MqttConfig = {
  brokerUrl: env.MQTT_BROKER_URL,  // ← No fallback! Sử dụng env trực tiếp
  username: env.MQTT_USERNAME,
  password: env.MQTT_PASSWORD,
  clientId: `smart-energy-backend-${env.NODE_ENV}`,
  topics: {
    powerReadings: 'smart-energy/power-readings/+/device/+',
    deviceStatus: 'smart-energy/status/+/device/+',
    control: 'smart-energy/control/+/device/+',
  },
  reconnectPeriod: 1000,
  keepalive: 60,
};