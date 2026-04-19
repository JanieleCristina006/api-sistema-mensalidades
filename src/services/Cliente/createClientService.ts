import { prisma } from "../../config/prisma";
import { addDays } from "date-fns";
import { PlanStatus, PaymentStatus } from "@prisma/client";

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
      throw new Error("Plano não cadastrado ou inativo/ARCHIVED");
    }

    if (existingCpf) {
      throw new Error("CPF já cadastrado!");
    }

    if (existingEmail) {
      throw new Error("Email já cadastrado!");
    }

    if (existingPhone) {
      throw new Error("Telefone já cadastrado!");
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