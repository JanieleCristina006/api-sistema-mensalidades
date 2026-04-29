import { PlanStatus } from "@prisma/client";
import { AppError } from "../../errors/appError";
import { prisma } from "../../config/prisma";
import { supabase } from "../../config/supabase";

interface CreatePlanProps {
  nome: string;
  preco: string;
  status?: PlanStatus;
  descricao: string;
  file: Express.Multer.File;
}

interface UploadImageProps {
  file: Express.Multer.File;
}

class CreatePlanService {
  async uploadImagem({ file }: UploadImageProps) {
    if (!file) {
      throw new AppError("Arquivo do banner não enviado.", 400, "BANNER_OBRIGATORIO");
    }

    const bucket = process.env.SUPABASE_BUCKET_PLANO;

    if (!bucket) {
      throw new AppError(
        "SUPABASE_BUCKET_PLANO não definido no ambiente.",
        500,
        "CONFIGURACAO_AUSENTE"
      );
    }

    const fileName = `plano-banner-${Date.now()}-${file.originalname}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw new AppError(
        `Falha ao enviar banner para o Supabase: ${error.message}`,
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

  async execute({
    nome,
    preco,
    status = PlanStatus.ACTIVE,
    file,
    descricao,
  }: CreatePlanProps) {
    const normalizedName = nome.toLowerCase().trim();

    const existingPlan = await prisma.plano.findUnique({
      where: {
        nome: normalizedName,
      },
    });

    if (existingPlan) {
      throw new AppError("Já existe um plano com esse nome.", 409, "PLANO_DUPLICADO");
    }

    const uploadBanner = await this.uploadImagem({ file });

    const createdPlan = await prisma.plano.create({
      data: {
        nome: normalizedName,
        descricao: descricao.trim(),
        banner: uploadBanner.url,
        preco,
        status,
      },
    });

    return createdPlan;
  }
}

export { CreatePlanService };
