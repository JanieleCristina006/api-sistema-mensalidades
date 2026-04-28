import { Request, Response } from "express";
import { CreatePlanService } from "../../services/Plano/createPlanService";

export class CreatePlanController {
  async handle(req: Request, res: Response) {
    const { nome, preco, status, descricao } = req.body;
    const file = req.file;

    const createPlanService = new CreatePlanService();

    if (!file) {
      return res.status(400).json({
        error:
          "Imagem e obrigatoria. Envie multipart/form-data com o arquivo no campo banner.",
      });
    }

    const createdPlan = await createPlanService.execute({
      nome,
      descricao,
      preco,
      status,
      file,
    });

    if (!createdPlan) {
      throw new Error("Plano nao cadastrado!");
    }

    return res.status(201).json(createdPlan);
  }
}
