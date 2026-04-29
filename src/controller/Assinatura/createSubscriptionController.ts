import { Request, Response } from "express";
import { CreateSubscriptionService} from "../../services/Assinatura/CreateSubscriptionService";


export class CreateSubscriptionController {
    async handle(req: Request, res: Response){
        const { id_plano } = req.body
        const id_cliente = Number(req.params.id);

        const service = new CreateSubscriptionService();

        service.execute({id_plano,id_cliente})

        res.status(201).json({
            message: "A assinatura foi adicionada com sucesso!",

        })
    }
}