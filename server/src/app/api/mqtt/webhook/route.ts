import { NextRequest, NextResponse } from 'next/server';
import { MqttService } from '@/services/mqtt.service';
import { z } from 'zod';
import { powerReadingValidator } from '@/validators/power-reading.validator';

const webhookSchema = z.object({
  readings: z.array(powerReadingValidator).min(1), // Bulk array
});

export async function POST(req: NextRequest) {
  try {
    const { readings } = webhookSchema.parse(await req.json());
    const mqttService = new MqttService();
    // Lưu trực tiếp vào DB (bypass MQTT nếu từ webhook)
    await mqttService.powerReadingService.createBulk(readings); // Giả sử service có method này
    return NextResponse.json({ success: true, count: readings.length }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}