import { Request, Response } from "express";
import { GetClientByIdService } from "../../services/Cliente/getClientByIdService";

export class GetClientByIdController {
  async handle(req: Request, res: Response) {
    const id = Number(req.params.id);

    const service = new GetClientByIdService();

    const data = await service.execute(id);

    if (!data) {
      throw new Error("Cliente não encontrado");
    }

    return res.status(200).json(data);
  }
}