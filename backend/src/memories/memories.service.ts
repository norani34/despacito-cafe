import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemoryDto } from './dto/create-memory.dto';

@Injectable()
export class MemoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.memory.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' } });
  }

  async create(dto: CreateMemoryDto, clientId?: string) {
    const record = await this.prisma.memory.create({
      data: {
        userName: dto.user,
        text_en: dto.text || '',
        text_ar: dto.text || '',
        image: dto.image || null,
        client_id: clientId || null
      }
    });
    return record;
  }

  async remove(id: number, clientId?: string) {
    const mem = await this.prisma.memory.findUnique({ where: { id } });
    if (!mem) throw new NotFoundException();
    if (mem.client_id && mem.client_id !== clientId) throw new ForbiddenException();
    return this.prisma.memory.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
