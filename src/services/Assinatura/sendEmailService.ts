import "dotenv/config";
import { AppError } from "../../errors/appError";
import { transporter } from "../../config/mail";

export class SendEmailService {
  async sendEmail(to: string, subject: string, text: string) {
    const emailFrom = process.env.EMAIL_FROM ?? process.env.EMAIL_USER;

    if (!emailFrom) {
      throw new AppError(
        "EMAIL_FROM ou EMAIL_USER precisa estar definido para enviar emails.",
        500,
        "CONFIGURACAO_AUSENTE"
      );
    }

    await transporter.sendMail({
      from: emailFrom,
      to,
      subject,
      text,
    });
  }
}
