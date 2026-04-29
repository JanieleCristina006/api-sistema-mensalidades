import "dotenv/config";
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { AppError } from "../../errors/appError";
import { prisma } from "../../config/prisma";
import { supabase } from "../../config/supabase";

interface CreateAdminProps {
  nome: string;
  email: string;
  senha: string;
  file: Express.Multer.File;
}

interface UploadImageProps {
  file: Express.Multer.File;
}

export class CreateAdminService {
  async uploadImagem({ file }: UploadImageProps) {
    if (!file) {
      throw new AppError("Arquivo do avatar não enviado.", 400, "AVATAR_OBRIGATORIO");
    }

    const bucket = process.env.SUPABASE_BUCKET;

    if (!bucket) {
      throw new AppError(
        "SUPABASE_BUCKET não definido no ambiente.",
        500,
        "CONFIGURACAO_AUSENTE"
      );
    }

    const fileName = `admin-${Date.now()}-${file.originalname}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw new AppError(
        `Falha ao enviar avatar para o Supabase: ${error.message}`,
        502,
        "UPLOAD_SUPABASE_FALHOU"
      );
    }

    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: publicUrl.publicUrl,
    };
  }

  async execute({ nome, email, senha, file }: CreateAdminProps) {
    const existEmail = await prisma.admin.findUnique({
      where: {
        email,
      },
    });

    if (existEmail) {
      throw new AppError("Email já cadastrado.", 409, "EMAIL_DUPLICADO");
    }

    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      throw new AppError(
        "JWT_SECRET não definido no ambiente.",
        500,
        "CONFIGURACAO_AUSENTE"
      );
    }

    const passwordencryption = await bcrypt.hash(senha, 10);
    const image = await this.uploadImagem({ file });

    const createAdm = await prisma.admin.create({
      data: {
        nome,
        avatar: image.url,
        email,
        senha: passwordencryption,
      },
    });

    const payload = {
      id: createAdm.id,
      nome: createAdm.nome,
      email: createAdm.email,
      senha: createAdm.senha,
    };

    const options: SignOptions = {
      expiresIn: "1h",
    };

    const token = jwt.sign(payload, secretKey, options);

    return {
      token,
    };
  }
}
