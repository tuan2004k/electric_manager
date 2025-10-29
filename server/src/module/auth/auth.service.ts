import { Injectable, UnauthorizedException, Logger, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    this.logger.log(`🔐 Attempting login for email: ${email}`);
    
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    this.logger.log(`📋 User found: ${!!user}`);
    
    if (user) {
      this.logger.log(`🔍 User details: ${JSON.stringify({
        id: user.id,
        email: user.email,
        hasPassword: !!user.password,
        role: user.role, // 👈 Log role để debug case (USER vs user)
      })}`);
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      this.logger.log(`🔑 Password valid: ${isPasswordValid}`);
      
      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
    }
    
    return null;
  }

  async login(loginDto: { email: string; password: string }) {
    this.logger.log(`🔐 Login attempt for: ${loginDto.email}`);
    
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    this.logger.log(`✅ Login successful for user: ${user.email}`);
    
    // 👈 SỬA: Chuẩn hóa roles thành lowercase để khớp với @Roles('user', 'admin')
    const normalizedRole = user.role.toLowerCase();
    const payload = { 
      username: user.email, 
      sub: user.id,
      roles: [normalizedRole], // Đảm bảo array lowercase ['admin'] hoặc ['user']
    };
    
    this.logger.log(`🔑 JWT payload: ${JSON.stringify(payload)}`); // 👈 Log payload để debug

    const accessToken = this.jwtService.sign(payload);
    
    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: normalizedRole, // Trả về lowercase cho client
      },
    };
  }

  async register(registerDto: { email: string; password: string; name: string }) {
    this.logger.log(`📝 Register attempt for: ${registerDto.email}`);
    
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    // 👈 SỬA: Đặt role mặc định lowercase 'user'
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
        role: 'USER', // Mặc định lowercase để khớp Guard
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    this.logger.log(`✅ User registered successfully: ${user.email} with role: ${user.role}`);
    
    // Tạo token cho user mới (sử dụng logic login để nhất quán)
    return this.login({ email: registerDto.email, password: registerDto.password });
  }
}