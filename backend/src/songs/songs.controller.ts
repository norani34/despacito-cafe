import { Body, Controller, Get, Post, Delete, Param, Headers } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';

@Controller('songs')
export class SongsController {
  constructor(private readonly svc: SongsService) {}

  @Get()
  async list() {
    return this.svc.findAll();
  }

  @Post()
  async create(@Body() dto: CreateSongDto, @Headers('x-client-id') clientId: string) {
    return this.svc.create(dto, clientId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Headers('x-client-id') clientId: string) {
    return this.svc.remove(Number(id), clientId);
  }
}
