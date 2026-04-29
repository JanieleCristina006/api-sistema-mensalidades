import { Request, Response } from "express";
import { CreateSubscriptionService } from "../../services/Assinatura/createSubscriptionService";

export class CreateSubscriptionController {
  async handle(req: Request, res: Response) {
    const { id_plano } = req.body;
    const id_cliente = Number(req.params.id);

    const service = new CreateSubscriptionService();

    const subscription = await service.execute({ id_plano, id_cliente });

    return res.status(201).json({
      message: "Assinatura adicionada com sucesso!",
      data: subscription,
    });
  }
}
