import { PlanStatus } from "@prisma/client";
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
      throw new Error("Plano nÃ£o encontrado!");
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
