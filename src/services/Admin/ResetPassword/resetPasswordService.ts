import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../../../errors/appError";
import { prisma } from "../../../config/prisma";

interface ResetPasswordProps {
  token: string;
  novaSenha: string;
}

export class ResetPasswordService {
  async execute({ token, novaSenha }: ResetPasswordProps) {
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      throw new AppError(
        "JWT_SECRET não definido no ambiente.",
        500,
        "CONFIGURACAO_AUSENTE"
      );
    }

    let decoded: { id: number };

    try {
      decoded = jwt.verify(token, secretKey) as { id: number };
    } catch {
      throw new AppError("Token inválido ou expirado.", 401, "TOKEN_INVALIDO");
    }

    const user = await prisma.admin.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      throw new AppError("Admin do token não encontrado.", 404, "ADMIN_NAO_ENCONTRADO");
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);

    await prisma.admin.update({
      where: {
        id: user.id,
      },
      data: {
        senha: senhaHash,
      },
    });

    return {
      message: "Senha redefinida com sucesso",
    };
  }
}
