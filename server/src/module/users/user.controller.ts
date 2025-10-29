import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiParam, ApiBearerAuth, ApiResponse } from '@nestjs/swagger'; 
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/role.guard';

@ApiTags('Users')
@ApiBearerAuth() 
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) 
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles('ADMIN') 
  @ApiResponse({ status: 200, description: 'List all users' })
  getAllUsers() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles('USER', 'ADMIN') 
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User profile' })
  getProfile(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get('profile/me')
  @Roles('USER', 'ADMIN') 
  @ApiResponse({ status: 200, description: 'Current user profile' })
  getMyProfile(@Request() req: any) {
    return this.userService.getMyProfile(req.user.id);
  }
}