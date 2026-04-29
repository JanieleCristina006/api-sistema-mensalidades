import { AppError } from "../../errors/appError";
import { prisma } from "../../config/prisma";

export class DeleteClientService {
  async execute(id: number) {
    const existingClient = await prisma.cliente.findUnique({
      where: {
        id,
      },
    });

    if (!existingClient) {
      throw new AppError("Cliente não encontrado.", 404, "CLIENTE_NAO_ENCONTRADO");
    }

    return prisma.cliente.delete({
      where: {
        id,
      },
    });
  }
}
