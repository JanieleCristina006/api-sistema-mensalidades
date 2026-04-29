import { PlanStatus } from "@prisma/client";
import { AppError } from "../../errors/appError";
import { prisma } from "../../config/prisma";

interface UpdateStatusPlanProps {
  status: PlanStatus;
  id: number;
}

export class UpdatePlanStatusService {
  async execute({ id, status }: UpdateStatusPlanProps) {
    const existingPlan = await prisma.plano.findUnique({
      where: {
        id,
      },
    });

    if (!existingPlan) {
      throw new AppError("Plano não encontrado.", 404, "PLANO_NAO_ENCONTRADO");
    }

    const updatedPlanStatus = await prisma.plano.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return updatedPlanStatus;
  }
}
