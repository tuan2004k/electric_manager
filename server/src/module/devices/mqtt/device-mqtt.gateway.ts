import { WebSocketGateway, OnGatewayInit } from '@nestjs/websockets';
import { PrismaService } from '../../../prisma/prisma.service';
import * as mqtt from 'mqtt';
import type { MqttClient } from 'mqtt';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@WebSocketGateway()
@Injectable()
export class DeviceMqttGateway implements OnGatewayInit {
    private mqttClient: MqttClient | null = null;
    private readonly logger = new Logger(DeviceMqttGateway.name);

    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
    ) { }

    afterInit() {
        this.logger.log('🚀 Initializing MQTT Gateway...');

        const brokerUrl = this.configService.get<string>('MQTT_BROKER_URL');
        const username = this.configService.get<string>('MQTT_USERNAME');
        const password = this.configService.get<string>('MQTT_PASSWORD');
        const topic = this.configService.get<string>('MQTT_TOPIC');
        const caPath = this.configService.get<string>('MQTT_CA_PATH');

        // Log configuration values (ẩn password)
        this.logger.log(`📋 Configuration loaded:`);
        this.logger.log(`   Broker URL: ${brokerUrl}`);
        this.logger.log(`   Username: ${username}`);
        this.logger.log(`   Password: ${password ? '***' : 'not set'}`);
        this.logger.log(`   Topic: ${topic}`);
        this.logger.log(`   CA Path: ${caPath}`);

        // Validate required configuration
        if (!brokerUrl) {
            this.logger.error('❌ MQTT_BROKER_URL is required but not set!');
            return;
        }

        if (!topic) {
            this.logger.error('❌ MQTT_TOPIC is required but not set!');
            return;
        }

        // Validate and read CA file if provided
        let caFile: Buffer | undefined;
        if (caPath) {
            try {
                if (!fs.existsSync(caPath)) {
                    this.logger.error(`❌ CA file not found at path: ${caPath}`);
                    return;
                }
                caFile = fs.readFileSync(path.resolve(caPath));
                this.logger.log('✅ CA file loaded successfully');
            } catch (error) {
                this.logger.error(`❌ Failed to read CA file from path: ${caPath}`, error);
                return;
            }
        }

        const mqttOptions: mqtt.IClientOptions = {
            username: username || undefined,
            password: password || undefined,
            ca: caFile,
          
            rejectUnauthorized: false,
            connectTimeout: 10000,
            reconnectPeriod: 5000,
        };

        this.logger.log(`🔗 Attempting to connect to MQTT broker: ${brokerUrl}`);

        try {
            this.mqttClient = mqtt.connect(brokerUrl, mqttOptions);

            this.mqttClient.on('connect', () => {
                this.logger.log(`✅ SUCCESS: Connected to MQTT broker: ${brokerUrl}`);
                this.logger.log(`📡 Subscribing to topic: ${topic}`);

                this.mqttClient!.subscribe(topic, { qos: 0 }, (err, granted) => {
                    if (err) {
                        this.logger.error('❌ Failed to subscribe:', err);
                    } else {
                        this.logger.log(`✅ Successfully subscribed to: ${JSON.stringify(granted)}`);
                    }
                });
            });

            this.mqttClient.on('message', async (receivedTopic, message) => {
                this.logger.log(`📥 Received message on topic: ${receivedTopic}`);

                try {
                    const payload = JSON.parse(message.toString());
                    this.logger.log(`📥 [${receivedTopic}] ${JSON.stringify(payload)}`);

                    if (payload.devices && Array.isArray(payload.devices)) {
                        this.logger.log(`🔧 Processing ${payload.devices.length} devices`);

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
                                this.logger.log(`✅ Saved data for device: ${dev.device_id}`);
                            } else {
                                this.logger.warn('⚠️ Skipping device with missing device_id or power_w:', dev);
                            }
                        }
                    } else {
                        this.logger.warn('⚠️ Received message without devices array:', payload);
                    }
                } catch (error) {
                    this.logger.error('❌ Error processing MQTT message:', error);
                }
            });

            this.mqttClient.on('error', (err) => {
                this.logger.error('❌ MQTT connection error:', err);
            });

            this.mqttClient.on('close', () => {
                this.logger.warn('🔌 MQTT connection closed');
            });

            this.mqttClient.on('offline', () => {
                this.logger.warn('🔌 MQTT client went offline');
            });

            this.mqttClient.on('reconnect', () => {
                this.logger.log('🔄 Attempting to reconnect to MQTT broker...');
            });

        } catch (error) {
            this.logger.error('❌ Failed to initialize MQTT client:', error);
        }
    }

    // ✅ PUBLIC METHOD ĐỂ KIỂM TRA TRẠNG THÁI
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

    // ✅ THÊM METHOD testPublish BỊ THIẾU
    public testPublish(topic: string, message: string): boolean {
        if (!this.mqttClient || !this.mqttClient.connected) {
            this.logger.error('❌ Cannot publish - MQTT client not connected');
            return false;
        }

        try {
            this.mqttClient.publish(topic, message);
            this.logger.log(`✅ Test message published to ${topic}: ${message}`);
            return true;
        } catch (error) {
            this.logger.error('❌ Failed to publish test message:', error);
            return false;
        }
    }
}