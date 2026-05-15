import { Request, Response } from "express";
import { DeactivateClientService } from "../../services/Cliente/DeactivateClientService";


export class DeactivateClientController {
  async handle(req: Request, res: Response) {
    const id = Number(req.params.id);

    const deactivateClientService = new DeactivateClientService();

    await deactivateClientService.execute(id);

    return res.status(200).json({
      message: "Cliente desativado com sucesso!",
    });
  }
}