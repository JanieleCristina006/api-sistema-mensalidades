import { Request, Response } from "express";
import { CreateClientService } from "../../services/Cliente/createClientService";

export class CreateClientController {
  async handle(req: Request, res: Response) {
    const { nome, email, cpf, telefone, plano_id } = req.body;

    const createClientService = new CreateClientService();

    const createdClientSubscription = await createClientService.execute({
      nome,
      email,
      cpf,
      telefone,
      plano_id,
    });

    if (!createdClientSubscription) {
      throw new Error("Cliente não cadastrado!");
    }

    res.status(201).json({
      message: "Cliente cadastrado!",
      data: createdClientSubscription,
    });
  }
}
