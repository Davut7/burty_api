import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailsService {
  private readonly logger = new Logger(MailsService.name);

  constructor(
    private readonly mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendEmailVerificationLink(email: string, link: string) {
    this.logger.log(`Sending email verification link to: ${email}`);
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test'
    ) {
      this.logger.log('In development mode, skipping email sending.');
      return { message: 'Mail send successfully!' };
    }
    await this.mailerService.sendMail({
      to: email,
      from: this.configService.getOrThrow('SMTP_USER'),
      subject: 'Request information',
      html: `
        <div>
        <p>Verify your email in myMental</p>
        <p>Go to link in below</p>
        <a href="${link}">${link}</a>
        </div>
      `,
    });

    this.logger.log('Email sent successfully!');
    return { message: 'Mail send successfully!' };
  }
}
