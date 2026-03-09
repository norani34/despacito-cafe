import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSongDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  artist: string;

  @IsOptional()
  @IsString()
  duration?: string;
}
