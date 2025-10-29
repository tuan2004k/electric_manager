import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiParam, ApiBearerAuth, ApiResponse } from '@nestjs/swagger'; // 👈 Thêm ApiResponse vào import
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/role.guard';

@ApiTags('Users')
@ApiBearerAuth() // Thêm Bearer Auth cho Swagger docs (vì dùng JWT global)
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // 👈 Áp dụng cho toàn bộ controller
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles('ADMIN') // 👈 Chỉ admin được access
  @ApiResponse({ status: 200, description: 'List all users' })
  getAllUsers() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles('USER', 'ADMIN') // 👈 User hoặc admin được access (có thể check ownership trong service)
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User profile' })
  getProfile(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get('profile/me')
  @Roles('USER', 'ADMIN') // 👈 User hoặc admin được access
  @ApiResponse({ status: 200, description: 'Current user profile' })
  getMyProfile(@Request() req: any) { // 👈 Lấy user từ JWT token
    // Trong thực tế, sử dụng req.user.id từ JWT payload
    return this.userService.getMyProfile(req.user.id);
  }
}