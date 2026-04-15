import { prisma } from "../../config/prisma";
import { PaymentMethod, PaymentStatus, SignatureStatus } from "@prisma/client";
import { addMonths } from "date-fns";

interface CreateSubscriptionPaymentProps {
  id_assinatura: number;
  valor: number;
  metodo: PaymentMethod;
  obs?: string;
}

class CreateSubscriptionPaymentService {
  async execute({ id_assinatura, metodo, obs }: CreateSubscriptionPaymentProps) {
    const existSignature = await prisma.assinatura.findUnique({
      where: {
        id: id_assinatura,
      },
      include: {
        plano:true
      }
    });

    if (!existSignature) {
      throw new Error("Assinatura não encontrada!");
    }

    if (existSignature.status === SignatureStatus.CANCELLED) {
      throw new Error("Assinatura cancelada não pode receber pagamento!");
    }

    const referencia_mes = existSignature.proximo_vencimento.getMonth() + 1;
    const referencia_ano = existSignature.proximo_vencimento.getFullYear();

    const existPayment = await prisma.pagamento.findFirst({
      where: {
        assinatura_id: id_assinatura,
        referencia_mes,
        referencia_ano,
      },
    });

    if (existPayment) {
      throw new Error("Já existe pagamento registrado para esse ciclo da assinatura!");
    }

    const result = await prisma.$transaction(async (tx) => {
      const pagamento = await tx.pagamento.create({
        data: {
          assinatura_id: id_assinatura,
          valor: existSignature.plano.preco,
          metodo,
          status: PaymentStatus.PAID,
          referencia_mes,
          referencia_ano,
          obs,
        },
      });

      await tx.assinatura.update({
        where: { id: id_assinatura },
        data: {
          status: SignatureStatus.ACTIVE,
          data_ultimo_pagamento: new Date(),
          proximo_vencimento: addMonths(existSignature.proximo_vencimento, 1),
        },
      });

      return pagamento;
    });

    return result;
  }
}

export { CreateSubscriptionPaymentService };