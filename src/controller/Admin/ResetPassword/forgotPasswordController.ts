import { Request, Response } from "express";
import { ForgotPasswordService } from "../../../services/Admin/ResetPassword/forgotPasswordService";

export class ForgotPasswordController {
  async handle(req: Request, res: Response) {
    const { email } = req.body;

    const forgotPasswordService = new ForgotPasswordService();

    const result = await forgotPasswordService.execute(email);

    return res.status(200).json(result);
  }
}
