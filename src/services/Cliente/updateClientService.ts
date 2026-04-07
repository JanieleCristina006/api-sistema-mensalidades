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
    if (!id) {
      throw new Error("Usuário não encontrado!");
    }

    const updatedClient = await prisma.client.update({
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