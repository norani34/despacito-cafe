import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { MemoriesModule } from './memories/memories.module';
import { SongsModule } from './songs/songs.module';
import { ContactModule } from './contact/contact.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    MemoriesModule,
    SongsModule,
    ContactModule,
    AuthModule,
    UsersModule
  ]
})
export class AppModule {}
