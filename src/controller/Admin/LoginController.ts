import { Request, Response } from "express";
import { LoginService } from "../../services/Admin/LoginService";

export class LoginController {
  async handle(req: Request, res: Response) {
    const { email, senha } = req.body;

    const loginService = new LoginService();

    const loginAdmin = await loginService.execute({
      email,
      senha,
    });

    if (!loginAdmin) {
      throw new Error("Falha ao realizar login!");
    }

    res.status(200).json({
      message: "Login realizado com sucesso!",
      data: loginAdmin,
    });
  }
}
