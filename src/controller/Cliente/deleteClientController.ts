import { Request, Response } from "express";
import { DeleteClientService } from "../../services/Cliente/deleteClientService";

export class DeleteClientController {
  async handle(req: Request, res: Response) {
    const id = Number(req.params.id);

    const deleteClientService = new DeleteClientService();

    await deleteClientService.execute(id);

    return res.status(200).json({
      message: "Cliente excluído com sucesso!",
    });
  }
}
