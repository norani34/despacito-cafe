import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSongDto } from './dto/create-song.dto';

@Injectable()
export class SongsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.song.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' } });
  }

  async create(dto: CreateSongDto, clientId?: string) {
    const record = await this.prisma.song.create({
      data: {
        title: dto.title,
        artist: dto.artist,
        duration: dto.duration || '',
        client_id: clientId || null,
        added_by: 'Guest'
      }
    });
    return record;
  }

  async remove(id: number, clientId?: string) {
    const row = await this.prisma.song.findUnique({ where: { id } });
    if (!row) throw new NotFoundException();
    if (row.client_id && row.client_id !== clientId) throw new ForbiddenException();
    return this.prisma.song.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
