import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ApartmentService } from './apartment.service';
import { CreateApartmentDto } from '../apartment/dto/create-apartment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt.guard'; 
import { RolesGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorators/roles.decorator'; 

@ApiTags('Apartments')
@ApiBearerAuth() 
@Controller('apartments')
@UseGuards(JwtAuthGuard, RolesGuard) 
export class ApartmentController {
  constructor(private apartmentService: ApartmentService) {}

  @Post()
  @Roles('USER', 'ADMIN') 
  @ApiBody({ type: CreateApartmentDto })
  @ApiResponse({ status: 201, description: 'Apartment created' })
  async create(@Body() body: CreateApartmentDto) {
    return this.apartmentService.create(body);
  }

  @Get('user/:userId')
  @Roles('USER', 'ADMIN') 
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List apartments for user' })
  async findAllByUser(@Param('userId') userId: string) {
    return this.apartmentService.findAll(userId);
  }

  @Get(':id')
  @Roles('USER', 'ADMIN') 
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