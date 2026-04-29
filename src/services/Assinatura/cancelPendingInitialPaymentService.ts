import { prisma } from "../../config/prisma";
import { PaymentStatus, SignatureStatus } from "@prisma/client";
import { subDays } from "date-fns";

export class CancelPendingInitialPaymentService {
  async execute() {

    const limite = subDays(new Date(), 1);

    // console.log("limite:", limite);
    const subscriptions = await prisma.assinatura.findMany({
      where: {
        status: SignatureStatus.PENDING,
        criado_em: {
          lte: limite,
        },
        pagamentos: {
          some: {
            status: PaymentStatus.PENDING,
          },
        },
      },
      include: {
        pagamentos: true,
      },
    });
    
// console.log(JSON.stringify(subscriptions, null, 2));

    for (const subscription of subscriptions) {
      await prisma.$transaction(async (tx) => {

        await tx.pagamento.updateMany({
          where: {
            assinatura_id: subscription.id,
            status: PaymentStatus.PENDING,
          },
          data: {
            status: PaymentStatus.FAILED,
            obs: "Pagamento inicial não realizado no prazo de 1 dia.",
          },
        });

       
        await tx.assinatura.update({
          where: {
            id: subscription.id,
          },
          data: {
            status: SignatureStatus.CANCELLED,
          },
        });
      });
    }

    // console.log("Encontradas para cancelar:", subscriptions.length);

    return {
      total_canceladas: subscriptions.length,
    };
  }
}
