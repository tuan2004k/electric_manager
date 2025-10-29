import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { DeviceType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDeviceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: DeviceType })
  @IsEnum(DeviceType)
  type: DeviceType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  macAddress: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  apartmentId: string;
}