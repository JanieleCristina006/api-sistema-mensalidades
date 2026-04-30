import { prisma } from "../../config/prisma";
import { PaymentMethod, PaymentStatus, SignatureStatus } from "@prisma/client";
import { addMonths } from "date-fns";
import { AppError } from "../../errors/appError";

interface ConfirmSubscriptionPaymentProps {
  id_assinatura: number;
  metodo: PaymentMethod;
  obs?: string;
}

function nextReferenceFromPayment(payment:{referencia_mes: number;referencia_ano: number;}) {
  const currentReference = new Date(
    payment.referencia_ano,
    payment.referencia_mes - 1,
    1
  );
  const nextReference = addMonths(currentReference, 1);

  return {
    referencia_mes: nextReference.getMonth() + 1,
    referencia_ano: nextReference.getFullYear(),
  };
}

class ConfirmSubscriptionPaymentService {
  async execute({ id_assinatura, metodo, obs }: ConfirmSubscriptionPaymentProps) {
    const existSignature = await prisma.assinatura.findUnique({
      where: {
        id: id_assinatura,
      },
      include: {
        plano: true,
      },
    });

    if (!existSignature) {
      throw new AppError(
        "Assinatura não encontrada.",
        404,
        "ASSINATURA_NAO_ENCONTRADA"
      );
    }

    if (existSignature.status === SignatureStatus.CANCELLED) {
      throw new AppError(
        "Assinatura cancelada não pode receber pagamento.",
        409,
        "ASSINATURA_CANCELADA"
      );
    }

    const existPayment = await prisma.pagamento.findFirst({
      where: {
        assinatura_id: id_assinatura,
        status: PaymentStatus.PENDING,
      },
      orderBy: [
        { referencia_ano: "asc" },
        { referencia_mes: "asc" },
        { criado_em: "asc" },
      ],
    });

    if (!existPayment) {
      throw new AppError(
        "Nenhum pagamento pendente encontrado para essa assinatura.",
        404,
        "PAGAMENTO_PENDENTE_NAO_ENCONTRADO"
      );
    }

    const paidAt = new Date();
    const nextDueDate =
      existSignature.status === SignatureStatus.PENDING
        ? existSignature.proximo_vencimento
        : addMonths(existSignature.proximo_vencimento, 1);
    const nextReference = nextReferenceFromPayment(existPayment);

    const result = await prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.pagamento.update({
        where: {
          id: existPayment.id,
        },
        data: {
          status: PaymentStatus.PAID,
          metodo,
          obs,
          pago_em: paidAt,
        },
      });

      const updatedSubscription = await tx.assinatura.update({
        where: { id: id_assinatura },
        data: {
          status: SignatureStatus.ACTIVE,
          data_ultimo_pagamento: paidAt,
          proximo_vencimento: nextDueDate,
        },
      });

      const existingNextPayment = await tx.pagamento.findUnique({
        where: {
          assinatura_id_referencia_mes_referencia_ano: {
            assinatura_id: id_assinatura,
            referencia_mes: nextReference.referencia_mes,
            referencia_ano: nextReference.referencia_ano,
          },
        },
      });

      const nextPayment =
        existingNextPayment ??
        (await tx.pagamento.create({
          data: {
            assinatura_id: id_assinatura,
            valor: existSignature.plano.preco,
            status: PaymentStatus.PENDING,
            metodo,
            referencia_mes: nextReference.referencia_mes,
            referencia_ano: nextReference.referencia_ano,
            obs: "Pagamento mensal gerado automaticamente",
          },
        }));

      return {
        assinatura: updatedSubscription,
        pagamento_confirmado: updatedPayment,
        proximo_pagamento: nextPayment,
      };
    });

    return result;
  }
}

export { ConfirmSubscriptionPaymentService };
