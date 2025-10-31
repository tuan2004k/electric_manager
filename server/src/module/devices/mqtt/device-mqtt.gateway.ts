import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import * as mqtt from 'mqtt';
import type { MqttClient, ISubscriptionGrant } from 'mqtt';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DeviceMqttGateway implements OnModuleInit {
  private mqttClient: MqttClient | null = null;
  private readonly logger = new Logger(DeviceMqttGateway.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) { }

  async onModuleInit() {
    this.logger.log(' Initializing MQTT Gateway...');

    const brokerUrl = this.configService.get<string>('MQTT_BROKER_URL');
    const username = this.configService.get<string>('MQTT_USERNAME');
    const password = this.configService.get<string>('MQTT_PASSWORD');
    const topicsStr = this.configService.get<string>('MQTT_TOPIC');
    const caPath = this.configService.get<string>('MQTT_CA_PATH');

    this.logger.log(` Configuration loaded:`);
    this.logger.log(`   Broker URL: ${brokerUrl}`);
    this.logger.log(`   Username: ${username}`);
    this.logger.log(`   Password: ${password ? '***' : 'not set'}`);
    this.logger.log(`   Topics: ${topicsStr}`);
    this.logger.log(`   CA Path: ${caPath}`);

    if (!brokerUrl || !topicsStr) {
      this.logger.error(' MQTT_BROKER_URL or MQTT_TOPIC missing!');
      return;
    }

    let caFile: Buffer | undefined;
    if (caPath) {
      try {
        const fullPath = path.resolve(caPath);
        if (!fs.existsSync(fullPath)) {
          this.logger.error(` CA file not found at ${fullPath}`);
          return;
        }
        caFile = fs.readFileSync(fullPath);
        this.logger.log(' CA file loaded successfully');
      } catch (error) {
        this.logger.error(` Failed to read CA file: ${error}`);
        return;
      }
    }

    const mqttOptions: mqtt.IClientOptions = {
      username: username || undefined,
      password: password || undefined,
      ca: caFile ? [caFile] : undefined,
      rejectUnauthorized: false,
      connectTimeout: 10000,
      reconnectPeriod: 5000,
    };

    this.logger.log(` Attempting to connect to MQTT broker: ${brokerUrl}`);

    try {
      this.mqttClient = mqtt.connect(brokerUrl, mqttOptions);

      this.mqttClient.on('connect', () => {
        this.logger.log(` SUCCESS: Connected to MQTT broker: ${brokerUrl}`);
        const topics = topicsStr.split(',').map(t => t.trim()).filter(t => t.length > 0);

        if (!this.mqttClient) {
          this.logger.error(' MQTT client is null - cannot subscribe');
          return;
        }

        this.mqttClient.subscribe(topics, { qos: 0 }, (err, granted) => {
          if (err) {
            this.logger.error(' Failed to subscribe to topics:', err);
            return;
          }

          if (!granted || granted.length === 0) {
            this.logger.error(' Subscribe response invalid (granted is null/empty)');
            return;
          }

          granted.forEach((grant, index) => {
            const topic = topics[index];
            if (typeof grant === 'object' && 'qos' in grant) {
              const subscription = grant as ISubscriptionGrant;
              if (subscription.qos === 128) {
                this.logger.error(` Subscribe failed for ${topic}: Unspecified error (128)`);
              } else {
                this.logger.log(` Subscribed to ${topic}: QoS ${subscription.qos}`);
              }
            } else {
              const qos = grant as number;
              if (qos === 128) {
                this.logger.error(` Subscribe failed for ${topic}: Unspecified error (128)`);
              } else {
                this.logger.log(` Subscribed to ${topic}: QoS ${qos}`);
              }
            }
          });
        });
      });

      this.mqttClient.on('message', async (topic, message) => {
        this.logger.log(` Received message on topic: ${topic}`);

        try {
          const payload = JSON.parse(message.toString());
          this.logger.log(` [${topic}] ${JSON.stringify(payload)}`);

          if (payload.devices && Array.isArray(payload.devices)) {
            this.logger.log(` Processing ${payload.devices.length} devices`);

            for (const dev of payload.devices) {
              if (dev.device_id && dev.power_w !== undefined) {
                await this.prisma.consumptionRecord.create({
                  data: {
                    device: { connect: { id: dev.device_id } },
                    voltage: 220,
                    current: dev.power_w / 220,
                    power: dev.power_w,
                    energy: 0,
                  },
                });
                this.logger.log(` Saved data for device: ${dev.device_id}`);
              } else {
                this.logger.warn(' Skipping device with missing device_id or power_w:', dev);
              }
            }
          } else {
            this.logger.warn(' Received message without devices array:', payload);
          }
        } catch (error) {
          this.logger.error(' Error processing MQTT message:', error);
        }
      });

      this.mqttClient.on('error', (err) => {
        this.logger.error(' MQTT connection error:', err);
      });

      this.mqttClient.on('close', () => {
        this.logger.warn(' MQTT connection closed');
      });

      this.mqttClient.on('offline', () => {
        this.logger.warn(' MQTT client offline');
      });

      this.mqttClient.on('reconnect', () => {
        this.logger.log(' Reconnecting to MQTT broker...');
      });

    } catch (error) {
      this.logger.error(' Failed to initialize MQTT client:', error);
    }
  }

  public getConnectionStatus(): any {
    if (!this.mqttClient) {
      return { 
        status: 'Not initialized', 
        connected: false, 
        timestamp: new Date().toISOString() 
      };
    }
    return { 
      status: this.mqttClient.connected ? 'Connected' : 'Disconnected', 
      connected: this.mqttClient.connected, 
      timestamp: new Date().toISOString() 
    };
  }

  public testPublish(topic: string, message: string): boolean {
    if (!this.mqttClient || !this.mqttClient.connected) {
      this.logger.error(' Cannot publish - MQTT client not connected');
      return false;
    }
    try {
      this.mqttClient.publish(topic, message);
      this.logger.log(` Test message published to ${topic}: ${message}`);
      return true;
    } catch (error) {
      this.logger.error(' Failed to publish test message:', error);
      return false;
    }
  }
}