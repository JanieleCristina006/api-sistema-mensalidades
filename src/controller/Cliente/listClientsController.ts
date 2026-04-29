import { Request, Response } from "express";
import { ListClientsService } from "../../services/Cliente/listClientsService";

export class ListClientsController {
  async handle(_req: Request, res: Response) {
    const listClientsService = new ListClientsService();

    const clientList = await listClientsService.execute();

    res.status(200).json(clientList);
  }
}
