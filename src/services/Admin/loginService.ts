import "dotenv/config";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { AppError } from "../../errors/appError";
import { prisma } from "../../config/prisma";

interface LoginProps {
  email: string;
  senha: string;
}

export class LoginService {
  async execute({ email, senha }: LoginProps) {
    const user = await prisma.admin.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new AppError("Email ou senha inválidos.", 401, "CREDENCIAIS_INVALIDAS");
    }

    const passwordValid = await bcrypt.compare(senha, user.senha);

    if (!passwordValid) {
      throw new AppError("Email ou senha inválidos.", 401, "CREDENCIAIS_INVALIDAS");
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      throw new AppError(
        "JWT_SECRET não definido no ambiente.",
        500,
        "CONFIGURACAO_AUSENTE"
      );
    }

    const options: SignOptions = {
      expiresIn: "1h",
    };

    const token = jwt.sign(payload, secretKey, options);

    return {
      token,
    };
  }
}
