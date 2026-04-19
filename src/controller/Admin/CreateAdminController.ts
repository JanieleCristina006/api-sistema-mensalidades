import { Request, Response } from "express";
import { CreateAdminService } from "../../services/Admin/CreateAdminService";

export class CreateAdminController {
  async handle(req: Request, res: Response) {
    const { nome, email, senha } = req.body;

    const createAdminService = new CreateAdminService();

    const createdAdmin = await createAdminService.execute({
      nome,
      email,
      senha,
    });

    if (!createdAdmin) {
      throw new Error("Admin não cadastrado!");
    }

    res.status(201).json({
      message: "Admin cadastrado!",
      data: createdAdmin,
    });
  }
}
