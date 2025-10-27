import { NextRequest, NextResponse } from 'next/server';
import { MqttService } from '@/services/mqtt.service';
import { authMiddleware } from '@/middleware/auth.middleware'; // Giả sử middleware

const publishSchema = z.object({
  deviceId: z.string(),
  apartmentId: z.string(),
  command: z.enum(['ON', 'OFF']),
});

export async function POST(req: NextRequest) {
  const user = await authMiddleware(req); // Verify JWT
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { deviceId, apartmentId, command } = publishSchema.parse(await req.json());
    const mqttService = new MqttService();
    await mqttService.sendControlCommand(deviceId, command, apartmentId);
    return NextResponse.json({ success: true, message: `Command ${command} sent to ${deviceId}` });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}