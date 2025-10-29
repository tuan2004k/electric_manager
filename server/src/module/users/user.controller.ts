import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from '../../common/decorators/auth.decorator';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Public()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}