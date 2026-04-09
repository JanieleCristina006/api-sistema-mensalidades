import { Request, Response } from "express";
import { getSignatureByIdService } from "../../services/Assinatura/getSignatureByIdService";

export class GetSignatureByIdController {
  async handle(req: Request, res: Response) {
    const id = Number(req.params.id);

    const service = new getSignatureByIdService();

    const data = await service.execute(id);

    if (!data) {
      throw new Error("Assinatura não encontrada!");
    }

    return res.status(200).json(data);
  }
}
