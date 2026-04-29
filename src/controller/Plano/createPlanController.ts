import { Request, Response } from "express";
import { CreatePlanService } from "../../services/Plano/createPlanService";
import { AppError } from "../../errors/appError";

export class CreatePlanController {
  async handle(req: Request, res: Response) {
    const { nome, preco, status, descricao } = req.body;
    const file = req.file;

    const createPlanService = new CreatePlanService();

    if (!file) {
      throw new AppError(
        "Imagem obrigatória. Envie multipart/form-data com o arquivo no campo banner.",
        400,
        "BANNER_OBRIGATORIO"
      );
    }

    const createdPlan = await createPlanService.execute({
      nome,
      descricao,
      preco,
      status,
      file,
    });

    return res.status(201).json(createdPlan);
  }
}
