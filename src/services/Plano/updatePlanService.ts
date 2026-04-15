import { prisma } from "../../config/prisma";

interface UpdatePlanProps {
  id: number;
  nome: string;
  preco: string;
}

export class UpdatePlanService {
  async execute({ nome, preco, id }: UpdatePlanProps) {
    const normalizedName = nome.toLowerCase().trim();

    const existingPlan = await prisma.plano.findUnique({
      where: {
        id,
      },
    });

    if (!existingPlan) {
      throw new Error("Plano nÃ£o encontrado!");
    }

    const updatedPlan = await prisma.plano.update({
      where: {
        id,
      },
      data: {
        nome: normalizedName,
        preco,
      },
    });

    return updatedPlan;
  }
}
