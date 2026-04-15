import { Request, Response } from "express";
import { UpdatePlanStatusService } from "../../services/Plano/updatePlanStatusService";

export class UpdatePlanStatusController {
  async handle(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { status } = req.body;

    const updatePlanStatusService = new UpdatePlanStatusService();

    const updatedPlanStatus = await updatePlanStatusService.execute({ status, id });

    return res.status(200).json({
      message: "O status do plano foi atualizado com sucesso!",
      data: updatedPlanStatus,
    });
  }
}
