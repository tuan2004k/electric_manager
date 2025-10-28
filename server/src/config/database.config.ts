import { PrismaModule } from 'nestjs-prisma';  // Nếu dùng package, hoặc custom

export const databaseProviders = [
  PrismaModule.forRoot({
    isGlobal: true,
  }),
];