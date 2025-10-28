import { IsString, IsNumber } from 'class-validator';

export class PredictionDto {
  @IsString()
  deviceId: string;

  @IsNumber()
  threshold: number;
}