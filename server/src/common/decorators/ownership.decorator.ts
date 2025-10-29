import { SetMetadata } from '@nestjs/common';

export const Ownership = (paramName: string) => SetMetadata('ownership', paramName);  // @Ownership('userId')