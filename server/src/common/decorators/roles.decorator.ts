import { SetMetadata } from '@nestjs/common';  // Fix: Import từ common

export const RolesKey = 'roles';  // Key cho Reflector

// Decorator @Roles('ADMIN', 'USER')
export const Roles = (...roles: string[]) => SetMetadata(RolesKey, roles);

// Decorator @Ownership('userId') cho ownership check
export const OwnershipKey = 'ownership';
export const Ownership = (paramName: string) => SetMetadata(OwnershipKey, paramName);