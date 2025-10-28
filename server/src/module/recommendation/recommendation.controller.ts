import { Controller, Get, Param, Patch } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';

@Controller('recommendations')
export class RecommendationController {
  constructor(private recommendationService: RecommendationService) {}

  @Get(':userId')
  async findAll(@Param('userId') userId: string) {
    return this.recommendationService.findAll(userId);
  }

  @Patch(':id/apply')
  async apply(@Param('id') id: string) {
    return this.recommendationService.apply(id);
  }
}