import { prisma } from "../../config/prisma";

export class GetClientByIdService {
  async execute(id: number) {
    if (!id) {
      throw new Error("UsÃºario nÃ£o encontrado!");
    }

    const client = prisma.cliente.findUnique({
      where: {
        id,
      },
    });

    return client;
  }
}
