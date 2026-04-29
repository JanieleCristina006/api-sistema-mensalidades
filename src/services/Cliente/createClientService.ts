import { prisma } from "../../config/prisma";
import { addDays } from "date-fns";
import { PlanStatus, PaymentStatus } from "@prisma/client";
import { AppError } from "../../errors/appError";

interface CreateClientSubscriptionProps {
  email: string;
  nome: string;
  cpf: string;
  telefone: string;
  plano_id: number;
}

export class CreateClientService {
  async execute({
    nome,
    email,
    cpf,
    telefone,
    plano_id,
  }: CreateClientSubscriptionProps) {

    const existingEmail = await prisma.cliente.findUnique({
      where: { email },
    });

    const existingPhone = await prisma.cliente.findUnique({
      where: { telefone },
    });

    const existingCpf = await prisma.cliente.findUnique({
      where: { cpf },
    });

    const existingPlan = await prisma.plano.findFirst({
      where: {
        id: plano_id,
        status: PlanStatus.ACTIVE,
      },
    });

    if (!existingPlan) {
      throw new AppError(
        "Plano não encontrado ou está inativo/arquivado.",
        404,
        "PLANO_INDISPONIVEL"
      );
    }

    if (existingCpf) {
      throw new AppError("CPF já cadastrado.", 409, "CPF_DUPLICADO");
    }

    if (existingEmail) {
      throw new AppError("Email já cadastrado.", 409, "EMAIL_DUPLICADO");
    }

    if (existingPhone) {
      throw new AppError("Telefone já cadastrado.", 409, "TELEFONE_DUPLICADO");
    }

    const result = await prisma.$transaction(async (tx) => {

      const createdClient = await tx.cliente.create({
        data: {
          nome,
          email,
          cpf,
          telefone,
        },
      });

      const createdSubscription = await tx.assinatura.create({
        data: {
          plano_id,
          client_id: createdClient.id,
          proximo_vencimento: addDays(new Date(), 30),
        },
      });

      const hoje = new Date();

      const createdPayment = await tx.pagamento.create({
        data: {
          assinatura_id: createdSubscription.id,
          valor: existingPlan.preco,
          status: PaymentStatus.PENDING,
          metodo: "PIX",
          referencia_mes: hoje.getMonth() + 1,
          referencia_ano: hoje.getFullYear(),
          obs: "Primeiro pagamento gerado automaticamente",
        },
      });

      return {
        createdClient,
        createdSubscription,
        createdPayment,
      };
    });

    return result;
  }
}
