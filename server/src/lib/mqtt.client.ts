import mqtt, { MqttClient, connectAsync } from 'mqtt';
import { mqttConfig } from '@/config/mqtt.config';
import { MqttClientWrapper } from '@/types/mqtt.types';

export class MqttClientSingleton {
  private static instance: MqttClientWrapper;
  private constructor() {}

  static async getInstance(): Promise<MqttClientWrapper> {
    if (!MqttClientSingleton.instance) {
      const client = await connectAsync(mqttConfig.brokerUrl, {
        clientId: mqttConfig.clientId,
        username: mqttConfig.username,
        password: mqttConfig.password,
        reconnectPeriod: mqttConfig.reconnectPeriod,
        keepalive: mqttConfig.keepalive,
        connectTimeout: 10000,  // ← Thêm: 10s timeout cho public broker (tránh hang nếu net chậm)
        clean: true,            // ← Thêm: Clean session (mặc định, nhưng explicit tốt hơn)
        protocolVersion: 4,     // ← Thêm: MQTT 3.1.1 (EMQX hỗ trợ tốt, fallback từ 5 nếu cần)
      });

      MqttClientSingleton.instance = {
        client,
        config: mqttConfig,
      };

      client.on('connect', () => {
        console.log('MQTT connected to', mqttConfig.brokerUrl);
      });
      client.on('reconnect', () => console.log('MQTT reconnecting...'));
      client.on('error', (err) => console.error('MQTT error:', err));
      client.on('close', () => console.log('MQTT closed'));
      client.on('offline', () => console.log('MQTT offline'));  // ← Thêm: Log khi mất kết nối
    }
    return MqttClientSingleton.instance;
  }

  static async disconnect() {
    if (MqttClientSingleton.instance) {
      await MqttClientSingleton.instance.client.end(true);  // ← Thêm true: Force end để clean
      MqttClientSingleton.instance = undefined;  // Reset instance để reconnect sau
    }
  }
}