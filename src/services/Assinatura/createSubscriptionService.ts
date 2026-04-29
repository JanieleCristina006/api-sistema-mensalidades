import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { AppError } from "../../errors/appError";
import { prisma } from "../../config/prisma";
import { addMonths } from "date-fns";

interface CreateSubscriptionProps {
  id_cliente: number;
  id_plano: number;
}

export class CreateSubscriptionService {
  async execute({ id_cliente, id_plano }: CreateSubscriptionProps) {
    const existClient = await prisma.cliente.findUnique({
      where: {
        id: id_cliente,
      },
    });

    if (!existClient) {
      throw new AppError("Cliente não encontrado.", 404, "CLIENTE_NAO_ENCONTRADO");
    }

    const existPlan = await prisma.plano.findFirst({
      where: {
        id: id_plano,
        status: "ACTIVE",
      },
    });

    if (!existPlan) {
      throw new AppError(
        "Plano não encontrado ou não está ativo.",
        404,
        "PLANO_INDISPONIVEL"
      );
    }

    const createSignature = await prisma.$transaction(async (tx) => {
      const createdSubscription = await tx.assinatura.create({
        data: {
          plano_id: id_plano,
          client_id: id_cliente,
          proximo_vencimento: addMonths(new Date(), 1),
        },
      });

      const hoje = new Date();

      const createdPayment = await tx.pagamento.create({
        data: {
          assinatura_id: createdSubscription.id,
          valor: existPlan.preco,
          status: PaymentStatus.PENDING,
          metodo: PaymentMethod.PIX,
          referencia_mes: hoje.getMonth() + 1,
          referencia_ano: hoje.getFullYear(),
          obs: "Primeiro pagamento gerado automaticamente",
        },
      });

      return {
        createdSubscription,
        createdPayment,
      };
    });

    return createSignature;
  }
}
