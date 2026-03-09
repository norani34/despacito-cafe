import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.BREVO_API_KEY;
  }

  async sendContactNotification(toEmail: string, subject: string, htmlBody: string) {
    if (!this.apiKey) {
      // In dev, skip sending
      console.warn('BREVO_API_KEY not set — skipping send');
      return { ok: false, reason: 'no_api_key' };
    }

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this.apiKey
      },
      body: JSON.stringify({
        sender: { name: 'Despacito Café', email: 'no-reply@despacito.cafe' },
        to: [{ email: toEmail }],
        subject,
        htmlContent: htmlBody
      })
    });

    const json = await res.json();
    return json;
  }
}
