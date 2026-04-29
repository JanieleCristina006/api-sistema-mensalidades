import { AppError } from "../../errors/appError";
import { prisma } from "../../config/prisma";

export class GetClientByIdService {
  async execute(id: number) {
    const client = await prisma.cliente.findUnique({
      where: {
        id,
      },
    });

    if (!client) {
      throw new AppError("Cliente não encontrado.", 404, "CLIENTE_NAO_ENCONTRADO");
    }

    return client;
  }
}
