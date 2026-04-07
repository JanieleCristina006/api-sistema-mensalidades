import { Request, Response } from "express";
import { DeleteClientService } from "../../services/Cliente/deleteClientService";

export class DeleteClientController {
  async handle(req: Request, res: Response) {
    const id = Number(req.params.id);

    const service = new DeleteClientService();

    const data = await service.execute(id);

    if (!data) {
      throw new Error("Cliente não encontrado");
    }

    return res.status(200).json({
        message: "Cliente excluído com sucesso!"
    });
  }
}