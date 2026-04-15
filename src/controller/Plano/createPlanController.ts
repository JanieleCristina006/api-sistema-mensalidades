import { Request, Response } from "express";
import { CreatePlanService } from "../../services/Plano/createPlanService";

export class CreatePlanController {
  async handle(req: Request, res: Response) {
    const { nome, preco, status } = req.body;

    const createPlanService = new CreatePlanService();

    const createdPlan = await createPlanService.execute({ nome, preco, status });

    if (!createdPlan) {
      throw new Error("Plano não cadastrado!");
    }

    res.status(201).json(createdPlan);
  }
}
