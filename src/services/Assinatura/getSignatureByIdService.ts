import { prisma } from "../../config/prisma";

export class GetSignatureByIdService {
  async execute(subscriptionId: number) {
    const subscription = prisma.assinatura.findUnique({
      where: {
        id: subscriptionId,
      },
    });

    if (!subscription) {
      throw new Error("Assinatura nÃ£o encontrada!");
    }

    return subscription;
  }
}
