import { MqttClientSingleton } from '@/lib/mqtt.client';
import { mqttConfig } from '@/config/mqtt.config';
import { DeviceService } from '@/services/device.service';
import { PowerReadingService } from '@/services/power-reading.service';
import { MqttMessage } from '@/types/mqtt.types';

export class MqttService {
    private deviceService = new DeviceService();
    private powerReadingService = new PowerReadingService();

    async publish(topic: string, message: string, qos = 1): Promise<void> {
        const { client } = await MqttClientSingleton.getInstance();
        await client.publishAsync(topic, message, { qos });
    }

    async subscribe(topic: string, callback: (topic: string, message: Buffer) => void, qos = 1): Promise<void> {
        const { client } = await MqttClientSingleton.getInstance();
        await client.subscribeAsync(topic, { qos });
        client.on('message', callback);
    }

    async handleDeviceStatus(message: MqttMessage): Promise<void> {
        const { deviceId, status } = message.payload; // e.g., { status: 'ON' }
        await this.deviceService.updateStatus(deviceId, status);
    }

    // Gửi control command (e.g., ON/OFF)
    async sendControlCommand(deviceId: string, command: 'ON' | 'OFF', apartmentId: string): Promise<void> {
        const topic = mqttConfig.topics.control.replace('+', apartmentId).replace('+', deviceId);
        const message = JSON.stringify({ command, timestamp: new Date().toISOString() });
        await this.publish(topic, message);
    }
    // ... other code

    async handlePowerReading(message: MqttMessage): Promise<void> {
        const { apartmentId, deviceId, wattage, timestamp } = message.payload;
        // Parse IDs to int to match schema
        const parsedApartmentId = parseInt(apartmentId, 10);  // ← Thêm: String → Int
        const parsedDeviceId = parseInt(deviceId, 10);  // ← Thêm: String → Int
        if (isNaN(parsedApartmentId) || isNaN(parsedDeviceId)) {
            console.error('Invalid IDs:', { apartmentId, deviceId });
            return;  // Skip nếu không parse được
        }
        await this.powerReadingService.createBulk([{
            apartmentId: parsedApartmentId,  // ← Pass int
            deviceId: parsedDeviceId,  // ← Pass int
            currentPowerW: wattage,
            totalEnergyKwh: 0.0,  // Từ fix trước
            timestamp
        }]);
        console.log(`Saved power reading: ${wattage}W for device ${deviceId}`);
    }
}