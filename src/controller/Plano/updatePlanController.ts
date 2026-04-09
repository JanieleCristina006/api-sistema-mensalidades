import { Request, Response } from "express";
import { UpdatePlanService } from "../../services/Plano/updatePlanService";

export class UpdatePlanController {
  async handle(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { nome,preco } = req.body

    const service = new UpdatePlanService();

    const data = await service.execute({nome,preco,id});

    return res.status(200).json({
      message: "Plano atualizado com sucesso",
      data,
  });
  }
}