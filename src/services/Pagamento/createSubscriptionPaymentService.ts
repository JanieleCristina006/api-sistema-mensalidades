import { prisma } from "../../config/prisma";
import { PaymentMethod, PaymentStatus, SignatureStatus } from "@prisma/client";
import { addMonths } from "date-fns";
import { AppError } from "../../errors/appError";

interface ConfirmSubscriptionPaymentProps {
  id_assinatura: number;
  metodo: PaymentMethod;
  obs?: string;
}

class ConfirmSubscriptionPaymentService {
  async execute({ id_assinatura, metodo, obs }: ConfirmSubscriptionPaymentProps) {
    
    const existSignature = await prisma.assinatura.findUnique({
      where: {
        id: id_assinatura,
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
    });

    if (!existPayment) {
      throw new AppError(
        "Nenhum pagamento pendente encontrado para essa assinatura.",
        404,
        "PAGAMENTO_PENDENTE_NAO_ENCONTRADO"
      );
    }

    const result = await prisma.$transaction(async (tx) => {

      const updatedPayment = await tx.pagamento.update({
        where: {
          id: existPayment.id,
        },
        data: {
          status: PaymentStatus.PAID,
          metodo,
          obs,
          pago_em: new Date(),
        },
      });

      await tx.assinatura.update({
        where: { id: id_assinatura },
        data: {
          status: SignatureStatus.ACTIVE,
          data_ultimo_pagamento: new Date(),
          proximo_vencimento: addMonths(new Date(), 1)
        },
      });

      return updatedPayment;
    });

    return result;
  }
}

export { ConfirmSubscriptionPaymentService };
