import { Request, Response } from "express";
import { UpdateClientService } from "../../services/Cliente/updateClientService";

export class UpdateClientController {
  async handle(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { email, nome, cpf, telefone } = req.body;

    const updateClientService = new UpdateClientService();

    const updatedClient = await updateClientService.execute({
      nome,
      email,
      cpf,
      telefone,
      id,
    });

    return res.status(200).json({
      message: "Cliente atualizado com sucesso",
      data: updatedClient,
    });
  }
}
