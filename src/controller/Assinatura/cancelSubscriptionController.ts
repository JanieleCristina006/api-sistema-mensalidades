import { Request, Response } from "express";
import { CancelSubscriptionService} from "../../services/Assinatura/cancelSubscriptionService";

export class CancelSubscriptionController {
 
  async handle(req: Request, res: Response) {
    const id_assinatura = Number(req.params.id);

    const service = new CancelSubscriptionService();

    const data = await service.execute(id_assinatura);

    if (!data) {
      throw new Error("Assinatura cancelada!");
    }

    return res.status(200).json(data);
  }
}
