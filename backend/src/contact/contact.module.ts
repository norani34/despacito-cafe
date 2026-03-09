import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ContactController]
})
export class ContactModule {}
