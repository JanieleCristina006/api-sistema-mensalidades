import { SignatureStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { SendEmailService } from "./SendEmailService";

export class CheckExpiredSubscription {
  emailService = new SendEmailService();

  async execute() {
    const hoje = new Date();

    const searchSubscriptions = await prisma.$transaction(async (tx) => {
      const expiradas = await tx.assinatura.findMany({
        where: {
          status: SignatureStatus.ACTIVE,
          proximo_vencimento: {
            lt: hoje,
          },
        },
        include: {
          client: true,
        },
      });

      for (const assinatura of expiradas) {
        const diffEmDias = Math.floor(
          (hoje.getTime() - assinatura.proximo_vencimento.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        if (diffEmDias % 3 === 0) {
          const mensagem = `Olá, ${assinatura.client.nome}!

Verificamos que a sua assinatura venceu.

Para continuar aproveitando nossos serviços, é necessário regularizar o pagamento o quanto antes.

Caso o pagamento já tenha sido realizado, desconsidere esta mensagem.

Se precisar de ajuda, estamos à disposição.

Atenciosamente,
Equipe`;

          await this.emailService.sendEmail(
            assinatura.client.email,
            "Sua assinatura venceu",
            mensagem
          );
        }
      }

      await tx.assinatura.updateMany({
        where: {
          id: {
            in: expiradas.map((a) => a.id),
          },
        },
        data: {
          status: SignatureStatus.OVERDUE,
        },
      });

      return expiradas;
    });

    console.log(searchSubscriptions);
  }
}