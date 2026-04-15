import { Request, Response } from "express";
import { CreateSubscriptionPaymentService } from "../../services/Pagamento/CreateSubscriptionPaymentService";

export class CreateSubscriptionPaymentController {
  async handle(req: Request, res: Response) {
    const id_assinatura = Number(req.params.id);
    const { valor, metodo, obs } = req.body;

    const createSubscriptionPaymentService = new CreateSubscriptionPaymentService();

    const createdSubscriptionPayment =
      await createSubscriptionPaymentService.execute({
        id_assinatura,
        valor,
        metodo,
        obs,
      });

    return res.status(200).json({
      message: "Pagamento da assinatura confirmado com sucesso!",
      data: createdSubscriptionPayment,
    });
  }
}
