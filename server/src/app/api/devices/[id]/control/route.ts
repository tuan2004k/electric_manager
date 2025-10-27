import { NextRequest, NextResponse } from 'next/server';
import { MqttService } from '@/services/mqtt.service';
import { DeviceService } from '@/services/device.service';
import { z } from 'zod';
import { authMiddleware } from '@/middleware/auth.middleware';

const controlSchema = z.object({
  command: z.enum(['ON', 'OFF']),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await authMiddleware(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { command } = controlSchema.parse(await req.json());
    const deviceService = new DeviceService();
    const mqttService = new MqttService();

    // Verify device belongs to user
    const device = await deviceService.getById(params.id);
    if (!device || device.userId !== user.id) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    // Update DB status immediately
    await deviceService.updateStatus(params.id, command);

    // Publish via MQTT
    await mqttService.sendControlCommand(params.id, command, device.apartmentId);

    return NextResponse.json({ success: true, status: command });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to control device' }, { status: 500 });
  }
}