import { Body, Controller, Get, Post, Req, Delete, Param, Headers } from '@nestjs/common';
import { MemoriesService } from './memories.service';
import { CreateMemoryDto } from './dto/create-memory.dto';

@Controller('memories')
export class MemoriesController {
  constructor(private readonly svc: MemoriesService) {}

  @Get()
  async list() {
    return this.svc.findAll();
  }

  @Post()
  async create(@Body() dto: CreateMemoryDto, @Headers('x-client-id') clientId: string) {
    return this.svc.create(dto, clientId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Headers('x-client-id') clientId: string) {
    return this.svc.remove(Number(id), clientId);
  }
}
