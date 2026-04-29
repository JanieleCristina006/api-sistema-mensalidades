import { Request, Response } from "express";
import { ConfirmSubscriptionPaymentService } from "../../services/Pagamento/createSubscriptionPaymentService";

export class CreateSubscriptionPaymentController {
  async handle(req: Request, res: Response) {
    const id_assinatura = Number(req.params.id);
    const { metodo, obs } = req.body;

    const createSubscriptionPaymentService = new ConfirmSubscriptionPaymentService();

    const createdSubscriptionPayment =
      await createSubscriptionPaymentService.execute({
        id_assinatura,
       
        metodo,
        obs,
      });

    return res.status(200).json({
      message: "Pagamento da assinatura confirmado com sucesso!",
      data: createdSubscriptionPayment,
    });
  }
}
