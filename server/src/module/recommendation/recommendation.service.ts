import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RecommendationService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.recommendation.findMany({ where: { userId }, include: { user: true } });
  }

  async apply(id: string) {
    return this.prisma.recommendation.update({ where: { id }, data: { applied: true } });
  }
}