import { prisma } from "../../config/prisma";
import { addDays } from "date-fns";
import { PlanStatus } from "@prisma/client";

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
    const existingEmail = await prisma.client.findUnique({
      where: {
        email,
      },
    });

    const existingPhone = await prisma.client.findUnique({
      where: {
        telefone,
      },
    });

    const existingCpf = await prisma.client.findUnique({
      where: {
        cpf,
      },
    });

    const existingPlan = await prisma.plano.findFirst({
      where: {
        id: plano_id,
        status: PlanStatus.ACTIVE,
      },
    });

    if (!existingPlan) {
      throw new Error("Plano nÃ£o cadastrado ou inativo/ARCHIVED");
    }

    if (existingCpf) {
      throw new Error("CPF jÃ¡ cadastrado!");
    }

    if (existingEmail) {
      throw new Error("Email jÃ¡ cadastrado!");
    }

    if (existingPhone) {
      throw new Error("Telefone jÃ¡ cadastrado!");
    }

    const createdClientSubscription = await prisma.$transaction(async (tx) => {
      const createdClient = await tx.client.create({
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

      return { createdClient, createdSubscription };
    });

    return createdClientSubscription;
  }
}
