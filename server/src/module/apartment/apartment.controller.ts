import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApartmentService } from './apartment.service';
import { CreateApartmentDto } from '../apartment/dto/create-apartment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard'; // Đường dẫn giả định dựa trên cấu trúc module
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator'; // Đường dẫn giả định dựa trên ví dụ trước

@ApiTags('Apartments')
@ApiBearerAuth() // Thêm Bearer Auth cho Swagger docs (vì dùng JWT global)
@Controller('apartments')
@UseGuards(JwtAuthGuard, RolesGuard) // Áp dụng guards cho toàn bộ controller (nếu không dùng global; bỏ nếu đã global)
export class ApartmentController {
  constructor(private apartmentService: ApartmentService) {}

  @Post()
  @Roles('USER', 'ADMIN') // Chỉ user hoặc admin mới tạo apartment
  @ApiBody({ type: CreateApartmentDto })
  @ApiResponse({ status: 201, description: 'Apartment created' })
  async create(@Body() body: CreateApartmentDto) {
    return this.apartmentService.create(body);
  }

  @Get('user/:userId')
  @Roles('USER', 'ADMIN') // Chỉ user đó hoặc admin mới xem apartments của user
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List apartments for user' })
  async findAllByUser(@Param('userId') userId: string) {
    return this.apartmentService.findAll(userId);
  }

  @Get(':id')
  @Roles('USER', 'ADMIN') // Auth required để xem chi tiết apartment
  @ApiParam({ name: 'id', description: 'Apartment ID' })
  @ApiResponse({ status: 200, description: 'Apartment details' })
  async findOne(@Param('id') id: string) {
    return this.apartmentService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiParam({ name: 'id', description: 'Apartment ID' })
  @ApiResponse({ status: 200, description: 'Apartment updated' })
  async update(@Param('id') id: string, @Body() body: Partial<CreateApartmentDto>) {
    return this.apartmentService.update(id, body);
  }
}