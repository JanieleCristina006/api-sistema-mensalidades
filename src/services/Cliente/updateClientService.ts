import { AppError } from "../../errors/appError";
import { prisma } from "../../config/prisma";

interface UpdateClientProps {
  id: number;
  email: string;
  nome: string;
  cpf: string;
  telefone: string;
}

export class UpdateClientService {
  async execute({ id, nome, email, cpf, telefone }: UpdateClientProps) {
    const existingClient = await prisma.cliente.findUnique({
      where: {
        id,
      },
    });

    if (!existingClient) {
      throw new AppError("Cliente não encontrado.", 404, "CLIENTE_NAO_ENCONTRADO");
    }

    const updatedClient = await prisma.cliente.update({
      where: {
        id,
      },
      data: {
        nome,
        cpf,
        email,
        telefone,
      },
    });

    return updatedClient;
  }
}
