import { Request, Response } from "express";
import { CancelSubscriptionService } from "../../services/Assinatura/cancelSubscriptionService";

export class CancelSubscriptionController {
  async handle(req: Request, res: Response) {
    const subscriptionId = Number(req.params.id);

    const cancelSubscriptionService = new CancelSubscriptionService();

    const cancelledSubscription = await cancelSubscriptionService.execute(subscriptionId);

    if (!cancelledSubscription) {
      throw new Error("Assinatura cancelada!");
    }

    return res.status(200).json(cancelledSubscription);
  }
}
