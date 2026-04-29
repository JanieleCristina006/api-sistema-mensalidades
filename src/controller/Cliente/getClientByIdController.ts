import { Request, Response } from "express";
import { GetClientByIdService } from "../../services/Cliente/getClientByIdService";

export class GetClientByIdController {
  async handle(req: Request, res: Response) {
    const id = Number(req.params.id);

    const getClientByIdService = new GetClientByIdService();

    const client = await getClientByIdService.execute(id);

    return res.status(200).json(client);
  }
}
