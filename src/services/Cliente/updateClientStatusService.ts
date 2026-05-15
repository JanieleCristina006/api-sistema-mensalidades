import { AppError } from "../../errors/appError";
import { prisma } from "../../config/prisma";
import { ClienteStatus } from "@prisma/client";

export class UpdateClientStatusService {
  async execute(id: number, status: ClienteStatus) {
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

    if (existingClient.status === status) {
      throw new AppError(
        "O cliente já está com esse status.",
        400,
        "STATUS_INALTERADO"
      );
    }

    return prisma.cliente.update({
      where: { id },
      data: {
        status,
      },
    });
  }
}