import { Request, Response } from "express";
import { CreateAdminService } from "../../services/Admin/CreateAdminService";

export class CreateAdminController {
  async handle(req: Request, res: Response) {
    const { nome, email, senha } = req.body;
    const file = req.file

    const createAdminService = new CreateAdminService();

    if (!file) {
        return res.status(400).json({
          error: "Imagem é obrigatória",
        });
      }

    const createdAdmin = await createAdminService.execute({
      nome,
      email,
      senha,
      file
    });

    if (!createdAdmin) {
      throw new Error("Admin não cadastrado!");
    }

    return res.status(201).json({
      message: "Admin cadastrado!",
      data: createdAdmin,
    });
  }
}
