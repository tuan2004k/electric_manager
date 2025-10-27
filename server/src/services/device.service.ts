import { prisma } from '@/lib/prisma';
import { Device } from '@prisma/client'; // Adjust nếu model khác

export class DeviceService {
  async getById(id: string): Promise<Device | null> {
    return prisma.device.findUnique({ where: { id } });
  }

  async updateStatus(id: string, status: string): Promise<Device> {
    return prisma.device.update({
      where: { id },
      data: { status },
    });
  }

  // Thêm methods khác nếu cần (create, delete, etc.)
}