import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMemoryDto {
  @IsNotEmpty()
  @IsString()
  user: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
