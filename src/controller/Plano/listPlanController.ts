import { Request, Response } from "express";
import { ListPlanService } from "../../services/Plano/listPlanService";

export class ListPlanController {
  async handle(_req: Request, res: Response) {
    const listPlanService = new ListPlanService();

    const planList = await listPlanService.execute();

    res.status(200).json(planList);
  }
}
