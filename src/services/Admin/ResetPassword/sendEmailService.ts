import "dotenv/config";
import { AppError } from "../../../errors/appError";
import { transporter } from "../../../config/mail";

export class SendEmailService {
  async sendResetPassword(email: string, link: string) {
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
      to: email,
      subject: "Recuperação de senha",
      html: `
        <h2>Reset de senha</h2>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${link}">Resetar senha</a>
        <p>Esse link expira em 15 minutos.</p>
      `,
    });
  }
}
