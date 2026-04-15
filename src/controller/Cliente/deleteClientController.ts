import { Request, Response } from "express";
import { DeleteClientService } from "../../services/Cliente/deleteClientService";

export class DeleteClientController {
  async handle(req: Request, res: Response) {
    const id = Number(req.params.id);

    const deleteClientService = new DeleteClientService();

    const deletedClient = await deleteClientService.execute(id);

    if (!deletedClient) {
      throw new Error("Cliente nÃ£o encontrado");
    }

    return res.status(200).json({
      message: "Cliente excluído com sucesso!",
    });
  }
}
