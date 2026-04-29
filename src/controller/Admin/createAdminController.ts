import { Request, Response } from "express";
import { AppError } from "../../errors/appError";
import { CreateAdminService } from "../../services/Admin/createAdminService";

export class CreateAdminController {
  async handle(req: Request, res: Response) {
    const { nome, email, senha } = req.body;
    const file = req.file;

    const createAdminService = new CreateAdminService();

    if (!file) {
      throw new AppError(
        "Imagem obrigatória. Envie multipart/form-data com o arquivo no campo avatar.",
        400,
        "AVATAR_OBRIGATORIO"
      );
    }

    const createdAdmin = await createAdminService.execute({
      nome,
      email,
      senha,
      file,
    });

    return res.status(201).json({
      message: "Admin cadastrado!",
      data: createdAdmin,
    });
  }
}
