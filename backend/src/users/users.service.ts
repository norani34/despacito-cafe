import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(email: string, password: string, role = 'USER') {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already exists');
    const hash = await argon2.hash(password);
    return this.prisma.user.create({ data: { email, password: hash, role } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    const u = await this.prisma.user.findUnique({ where: { id } });
    if (!u) throw new NotFoundException();
    return u;
  }

  async setCurrentRefreshTokenHash(userId: number, tokenHash: string, expiresAt: Date) {
    return this.prisma.refreshToken.create({ data: { tokenHash, userId, expiresAt } });
  }

  async revokeRefreshToken(tokenId: number) {
    return this.prisma.refreshToken.update({ where: { id: tokenId }, data: { revoked: true } });
  }

  async findRefreshByJti(jti: string) {
    return this.prisma.refreshToken.findUnique({ where: { jti } });
  }

  async revokeByJti(jti: string) {
    return this.prisma.refreshToken.updateMany({ where: { jti }, data: { revoked: true } });
  }

  async createRefreshToken(userId: number, tokenHash: string, jti: string, expiresAt: Date) {
    return this.prisma.refreshToken.create({ data: { userId, tokenHash, jti, expiresAt } });
  }
}
