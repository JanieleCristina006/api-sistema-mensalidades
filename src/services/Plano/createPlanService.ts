import { PlanStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";

interface CreatePlanProps {
  nome: string;
  preco: string;
  status?: PlanStatus;
}

class CreatePlanService {
  async execute({ nome, preco, status = PlanStatus.ACTIVE }: CreatePlanProps) {
    const normalizedName = nome.toLowerCase().trim();

    const existingPlan = await prisma.plano.findUnique({
      where: {
        nome: normalizedName,
      },
    });

    if (existingPlan) {
      throw new Error("O plano jÃ¡ existe!");
    }

    const createdPlan = await prisma.plano.create({
      data: {
        nome: normalizedName,
        preco,
        status,
      },
    });

    return createdPlan;
  }
}

export { CreatePlanService };
