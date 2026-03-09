import { Body, Controller, Post, Req, Ip } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

// simple sanitization helper
const sanitize = (s: string) => s.replace(/</g, '&lt;').replace(/>/g, '&gt;');

@Controller('contact')
export class ContactController {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  @Post()
  async submit(@Body() dto: CreateContactDto, @Ip() ip: string) {
    // Basic flow: validate (handled by DTO), store, enqueue email (placeholder)
    const clean = { name: sanitize(dto.name), email: sanitize(dto.email), message: sanitize(dto.message) };
    const rec = await this.prisma.contact.create({ data: { ...clean, ip } });

    // Send async notification to admin (fire-and-forget)
    this.mail.sendContactNotification(process.env.ADMIN_EMAIL || 'admin@despacito.cafe', 'New contact submission', `<p><strong>${clean.name}</strong> (${clean.email})</p><p>${clean.message}</p>`).catch(err => console.error('Mail error', err));

    return { ok: true, id: rec.id };
  }
}
