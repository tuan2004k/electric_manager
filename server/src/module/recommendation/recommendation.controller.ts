import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RecommendationService } from './recommendation.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard'; // Đường dẫn giả định dựa trên cấu trúc module
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator'; // Đường dẫn giả định dựa trên ví dụ trước

@ApiTags('Recommendations')
@ApiBearerAuth() // Thêm Bearer Auth cho Swagger docs (vì dùng JWT global)
@Controller('recommendations')
@UseGuards(JwtAuthGuard, RolesGuard) // Áp dụng guards cho toàn bộ controller (nếu không dùng global; bỏ nếu đã global)
export class RecommendationController {
  constructor(private recommendationService: RecommendationService) {}

  @Get(':userId')
  @Roles('USER', 'ADMIN') // Chỉ user (chủ sở hữu) hoặc admin mới xem recommendations
  @ApiParam({ name: 'userId', description: 'User ID' })
  async findAll(@Param('userId') userId: string) {
    return this.recommendationService.findAll(userId);
  }

  @Patch(':id/apply')
  @Roles('USER', 'ADMIN') // User hoặc admin mới apply recommendation (có thể check ownership trong service)
  @ApiParam({ name: 'id', description: 'Recommendation ID' })
  @ApiResponse({ status: 200, description: 'Applied' })
  async apply(@Param('id') id: string) {
    return this.recommendationService.apply(id);
  }
}