import { NextRequest, NextResponse } from 'next/server';
import { DeviceService } from '@/services/device.service';
import { redisClient } from '@/config/redis'; // Giả sử Redis singleton
import { authMiddleware } from '@/middleware/auth.middleware';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await authMiddleware(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const deviceService = new DeviceService();
    const device = await deviceService.getById(params.id);
    if (!device || device.userId !== user.id) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    // Cache status in Redis (TTL 30s, update via MQTT subscriber)
    let status = await redisClient.get(`device:status:${params.id}`);
    if (!status) {
      status = device.status || 'UNKNOWN';
      await redisClient.setex(`device:status:${params.id}`, 30, status);
    }

    return NextResponse.json({ id: params.id, status, lastUpdated: device.updatedAt });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get status' }, { status: 500 });
  }
}