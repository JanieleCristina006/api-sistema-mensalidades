import { Request, Response } from "express";
import { ResetPasswordService } from "../../../services/Admin/ResetPassword/resetPasswordService";

export class ResetPasswordController {
  async handle(req: Request, res: Response) {
    const { token, novaSenha } = req.body;

    const resetPasswordService = new ResetPasswordService();

    const result = await resetPasswordService.execute({
      token,
      novaSenha,
    });

    return res.status(200).json(result);
  }
}
