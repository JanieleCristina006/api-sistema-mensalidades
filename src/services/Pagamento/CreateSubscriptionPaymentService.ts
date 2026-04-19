import { prisma } from "../../config/prisma";
import { PaymentMethod, PaymentStatus, SignatureStatus } from "@prisma/client";
import { addMonths } from "date-fns";

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
      throw new Error("Assinatura não encontrada!");
    }

    if (existSignature.status === SignatureStatus.CANCELLED) {
      throw new Error("Assinatura cancelada não pode receber pagamento!");
    }

    //const referencia_mes = existSignature.proximo_vencimento.getMonth() + 1;
    //const referencia_ano = existSignature.proximo_vencimento.getFullYear();

 
    const existPayment = await prisma.pagamento.findFirst({
      where: {
        assinatura_id: id_assinatura,
        status: PaymentStatus.PENDING,
      },
    });

    if (!existPayment) {
      throw new Error("Nenhum pagamento pendente encontrado para esse ciclo!");
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