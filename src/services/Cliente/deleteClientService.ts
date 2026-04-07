import { prisma } from "../../config/prisma";

export class DeleteClientService {
  async execute(id: number) {
    
    if (!id) {
      throw new Error("Usuário não encontrado!");
    }

    return await prisma.client.deleteMany({
      where: {
        id,
      },
    });

    
  }
}