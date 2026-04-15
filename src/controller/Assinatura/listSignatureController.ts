import { Request, Response } from "express";
import { ListSignatureService } from "../../services/Assinatura/listSignatureService";

export class ListSignatureController {
  async handle(_req: Request, res: Response) {
    const listSignatureService = new ListSignatureService();

    const subscriptionList = await listSignatureService.execute();

    if (!subscriptionList) {
      throw new Error("Erro ao buscar assinaturas");
    }

    res.status(200).json(subscriptionList);
  }
}
