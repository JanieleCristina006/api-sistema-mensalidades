import { Request, Response } from "express";
import { UpdateStatusPlanService } from "../../services/Plano/updatePlanStatusService";

export class UpdateStatusPlanController {
  async handle(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { status } = req.body

    const service = new UpdateStatusPlanService();

    const data = await service.execute({status,id});

    return res.status(200).json({
      message: "O status do plano foi atualizado com sucesso!",
      data,
  });
  }
}