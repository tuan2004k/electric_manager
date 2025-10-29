import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiParam, ApiResponse } from '@nestjs/swagger';
import { RecommendationService } from './recommendation.service';

@ApiTags('Recommendations')
@Controller('recommendations')
export class RecommendationController {
  constructor(private recommendationService: RecommendationService) {}

  @Get(':userId')
  @ApiParam({ name: 'userId', description: 'User ID' })
  async findAll(@Param('userId') userId: string) {
    return this.recommendationService.findAll(userId);
  }

  @Patch(':id/apply')
  @ApiParam({ name: 'id', description: 'Recommendation ID' })
  @ApiResponse({ status: 200, description: 'Applied' })
  async apply(@Param('id') id: string) {
    return this.recommendationService.apply(id);
  }
}