import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';  // Để check ownership

export const Roles = Reflector.createDecorator<string[]>();  // Decorator @Roles('ADMIN')

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;  // Không yêu cầu role → OK

    const request = context.switchToHttp().getRequest();
    const user = request.user;  // Từ JwtGuard (payload: sub = userId, role)

    if (!user) {
      throw new ForbiddenException('Not authenticated');  // Tránh, vì JwtGuard đã check
    }

    if (user.role === 'ADMIN') {
      return true;  // Admin full quyền - bypass tất cả
    }

    if (!requiredRoles.includes('USER')) {
      throw new ForbiddenException('Insufficient permissions');  // Không đủ role
    }

    // User: Check ownership (data thuộc user này)
    const userId = user.sub;  // user ID từ token
    const ownershipParam = this.reflector.getAllAndOverride<string>('ownership', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (ownershipParam) {
      // Check param (e.g., :userId in route) == userId
      const paramValue = request.params[ownershipParam];
      if (paramValue !== userId) {
        throw new ForbiddenException('Not authorized for this resource');  // User không được xem data của người khác
      }
    }

    return true;
  }
}