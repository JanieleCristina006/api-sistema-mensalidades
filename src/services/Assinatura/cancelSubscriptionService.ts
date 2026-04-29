import { prisma } from "../../config/prisma";
import { SignatureStatus } from "@prisma/client";
import { AppError } from "../../errors/appError";

export class CancelSubscriptionService {
  async execute(subscriptionId: number) {
    const existingSubscription = await prisma.assinatura.findUnique({
      where: {
        id: subscriptionId,
      },
    });

    if (!existingSubscription) {
      throw new AppError(
        "Assinatura não encontrada.",
        404,
        "ASSINATURA_NAO_ENCONTRADA"
      );
    }

    if (existingSubscription.status === SignatureStatus.CANCELLED) {
      throw new AppError(
        "Assinatura já está cancelada.",
        409,
        "ASSINATURA_JA_CANCELADA"
      );
    }

    const updatedSubscription = await prisma.assinatura.update({
      where: {
        id: subscriptionId,
      },
      data: {
        status: SignatureStatus.CANCELLED,
      },
    });

    return updatedSubscription;
  }
}
