import { Request, Response } from "express";
import { LoginService } from "../../services/Admin/loginService";

export class LoginController {
  async handle(req: Request, res: Response) {
    const { email, senha } = req.body;

    const loginService = new LoginService();

    const loginAdmin = await loginService.execute({
      email,
      senha,
    });

    res.status(200).json({
      message: "Login realizado com sucesso!",
      data: loginAdmin,
    });
  }
}
