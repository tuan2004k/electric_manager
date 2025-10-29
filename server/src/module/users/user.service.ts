import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.user.findMany({ include: { apartments: true } });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id }, include: { apartments: true } });
  }
 
}