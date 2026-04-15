import { Request, Response } from "express";
import { GetSignatureByIdService } from "../../services/Assinatura/getSignatureByIdService";

export class GetSignatureByIdController {
  async handle(req: Request, res: Response) {
    const id = Number(req.params.id);

    const getSignatureByIdService = new GetSignatureByIdService();

    const subscription = await getSignatureByIdService.execute(id);

    if (!subscription) {
      throw new Error("Assinatura não encontrada!");
    }

    return res.status(200).json(subscription);
  }
}
