import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RecommendationService } from './recommendation.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard'; 
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator'; 

@ApiTags('Recommendations')
@ApiBearerAuth() 
@Controller('recommendations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RecommendationController {
  constructor(private recommendationService: RecommendationService) {}

  @Get(':userId')
  @Roles('USER', 'ADMIN') 
  @ApiParam({ name: 'userId', description: 'User ID' })
  async findAll(@Param('userId') userId: string) {
    return this.recommendationService.findAll(userId);
  }

  @Patch(':id/apply')
  @Roles('USER', 'ADMIN') 
  @ApiParam({ name: 'id', description: 'Recommendation ID' })
  @ApiResponse({ status: 200, description: 'Applied' })
  async apply(@Param('id') id: string) {
    return this.recommendationService.apply(id);
  }
}