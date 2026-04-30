import "dotenv/config";
import jwt from "jsonwebtoken";
import { AppError } from "../../../errors/appError";
import { prisma } from "../../../config/prisma";
import { SendEmailService } from "./sendEmailService";

export class ForgotPasswordService {
  emailService = new SendEmailService();

  async execute(email: string) {
    const user = await prisma.admin.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        message: "Se o email existir, enviaremos um link",
      };
    }

    const secretKey = process.env.JWT_RESET_SECRET;

    if (!secretKey) {
      throw new AppError(
        "JWT_RESET_SECRET não definido no ambiente.",
        500,
        "CONFIGURACAO_AUSENTE"
      );
    }

    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "15m" });
    const link = `http://localhost:3000/reset-password?token=${token}`;

    try {
      await this.emailService.sendResetPassword(email, link);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "erro desconhecido";

      throw new AppError(
        `Falha ao enviar email de recuperação de senha: ${detail}`,
        502,
        "EMAIL_ENVIO_FALHOU"
      );
    }

    return {
      message: "Se o email existir, enviaremos um link",
    };
  }
}
