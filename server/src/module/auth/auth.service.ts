import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }
  

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const payload = { email: user.email, sub: user.id, role: user.role };  // sub = user ID, role = 'USER' hoặc 'ADMIN'
return {
  access_token: this.jwtService.sign(payload),
};
  }

  async register(email: string, password: string, name: string) {
    try {
      const existingUser = await this.prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      return this.prisma.user.create({
        data: { email, password: hashedPassword, name },
      });
    } catch (error) {
      if (error.code === 'P2002') {  
        throw new BadRequestException('Email already in use');
      }
      console.error('Register error:', error);  
      throw new InternalServerErrorException('Registration failed');
    }
  }
  
}