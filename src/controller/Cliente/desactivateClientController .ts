import { Request, Response } from "express";
import { UpdateClientStatusService } from "../../services/Cliente/updateClientStatusService";
import { ClienteStatus } from "@prisma/client";

export class UpdateClientStatusController {
  async handle(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { status } = req.body as { status: ClienteStatus };

    const updateClientStatusService = new UpdateClientStatusService();

    await updateClientStatusService.execute(id, status);

    return res.status(200).json({
      message: `Cliente atualizado para ${status} com sucesso!`,
    });
  }
}