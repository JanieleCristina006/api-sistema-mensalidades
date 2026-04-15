import { prisma } from "../../config/prisma";

export class GetClientByIdService {
  async execute(id: number) {
    if (!id) {
      throw new Error("UsÃºario nÃ£o encontrado!");
    }

    const client = prisma.client.findUnique({
      where: {
        id,
      },
    });

    return client;
  }
}
