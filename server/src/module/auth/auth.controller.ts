import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';  // Import mới
import { Public } from '../../common/decorators/auth.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login success' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @Public()
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User created' })
  async register(@Body() body: RegisterDto) {  
    return this.authService.register(body.email, body.password, body.name);
  }
}