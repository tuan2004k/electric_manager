import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateApartmentDto } from '../apartment/dto/create-apartment.dto';

@Injectable()
export class ApartmentService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateApartmentDto) {
    // Check user exists
    const user = await this.prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return this.prisma.apartment.create({
      data,
      include: { user: true },  // Include user để trả về full info
    });
  }

  async findAll(userId: string) {
    return this.prisma.apartment.findMany({
      where: { userId },
      include: { devices: true },  // Include devices liên kết
    });
  }

  async findOne(id: string) {
    return this.prisma.apartment.findUnique({
      where: { id },
      include: { user: true, devices: true },
    });
  }

  async update(id: string, data: Partial<CreateApartmentDto>) {
    return this.prisma.apartment.update({
      where: { id },
      data,
    });
  }
}