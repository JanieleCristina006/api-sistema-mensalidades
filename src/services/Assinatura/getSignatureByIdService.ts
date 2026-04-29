import { AppError } from "../../errors/appError";
import { prisma } from "../../config/prisma";

export class GetSignatureByIdService {
  async execute(subscriptionId: number) {
    const subscription = await prisma.assinatura.findUnique({
      where: {
        id: subscriptionId,
      },
    });

    if (!subscription) {
      throw new AppError(
        "Assinatura não encontrada.",
        404,
        "ASSINATURA_NAO_ENCONTRADA"
      );
    }

    return subscription;
  }
}
