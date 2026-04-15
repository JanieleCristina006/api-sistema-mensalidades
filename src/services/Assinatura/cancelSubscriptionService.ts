import { prisma } from "../../config/prisma";
import { SignatureStatus } from "@prisma/client";

export class CancelSubscriptionService {
  async execute(subscriptionId: number) {
    const existingSubscription = await prisma.assinatura.findUnique({
      where: {
        id: subscriptionId,
      },
    });

    if (!existingSubscription) {
      throw new Error("Assinatura nÃ£o encontrada!");
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
