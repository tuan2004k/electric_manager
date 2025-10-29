import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ApartmentService } from './apartment.service';
import { CreateApartmentDto } from '../apartment/dto/create-apartment.dto';

@ApiTags('Apartments')
@Controller('apartments')
export class ApartmentController {
  constructor(private apartmentService: ApartmentService) {}

  @Post()
  @ApiBody({ type: CreateApartmentDto })
  @ApiResponse({ status: 201, description: 'Apartment created' })
  async create(@Body() body: CreateApartmentDto) {
    return this.apartmentService.create(body);
  }

  @Get('user/:userId')
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List apartments for user' })
  async findAllByUser(@Param('userId') userId: string) {
    return this.apartmentService.findAll(userId);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Apartment ID' })
  @ApiResponse({ status: 200, description: 'Apartment details' })
  async findOne(@Param('id') id: string) {
    return this.apartmentService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Apartment ID' })
  @ApiResponse({ status: 200, description: 'Apartment updated' })
  async update(@Param('id') id: string, @Body() body: Partial<CreateApartmentDto>) {
    return this.apartmentService.update(id, body);
  }
}