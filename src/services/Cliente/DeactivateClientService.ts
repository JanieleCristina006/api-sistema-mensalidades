import { AppError } from "../../errors/appError";
import { prisma } from "../../config/prisma";

export class DeactivateClientService {
  async execute(id: number) {
    const existingClient = await prisma.cliente.findUnique({
      where: { id },
    });

    if (!existingClient) {
      throw new AppError(
        "Cliente não encontrado.",
        404,
        "CLIENTE_NAO_ENCONTRADO"
      );
    }

    if (existingClient.status === "INACTIVE") {
      throw new AppError(
        "Cliente já está desativado.",
        400,
        "CLIENTE_JA_INATIVO"
      );
    }

    return prisma.cliente.update({
      where: { id },
      data: {
        status: "INACTIVE",
      },
    });
  }
}