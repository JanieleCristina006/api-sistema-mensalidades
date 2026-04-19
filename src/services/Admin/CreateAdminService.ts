import "dotenv/config";
import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";

interface CreateAdminProps {
  nome: string;
  email: string;
  senha: string;
}

export class CreateAdminService {
  async execute({ nome, email, senha }: CreateAdminProps) {
    const passwordencryption = await bcrypt.hash(senha, 10);
    console.log(`Senha criptografada: ${senha}`);

    const existEmail = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });

    if (existEmail) {
      throw new Error("Email já cadastrado!");
    }

    const createAdm = prisma.admin.create({
      data: {
        nome: nome,
        email: email,
        senha: passwordencryption,
      },
    });

    const payload = {
      id: (await createAdm).id,
      nome: (await createAdm).nome,
    };

    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      throw new Error("JWT_SECRET não definido");
    }

    const options: SignOptions = {
      expiresIn: "1h",
    };

    const token = jwt.sign(payload, secretKey, options);

    return {
        token: `${token}`
    };
  }
}
