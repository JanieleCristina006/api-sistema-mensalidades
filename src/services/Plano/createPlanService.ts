import { PlanStatus } from "@prisma/client";
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
      throw new Error("Arquivo nao enviado!");
    }

    const bucket = process.env.SUPABASE_BUCKET_PLANO;

    if (!bucket) {
      throw new Error("SUPABASE_BUCKET_PLANO nao definido");
    }

    const fileName = `plano-banner-${Date.now()}-${file.originalname}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw new Error(error.message);
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
      throw new Error("O plano ja existe!");
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
