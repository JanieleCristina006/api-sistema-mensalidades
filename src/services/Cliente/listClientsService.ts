import { prisma } from "../../config/prisma";

export class ListClientsService {
  async execute() {
    const clientList =
      await prisma.cliente.findMany({
        include: {
          assinaturas: {
            include: {
              plano: true,
              pagamentos: true,
            },
          },
        },
      });

    return clientList;
  }
}