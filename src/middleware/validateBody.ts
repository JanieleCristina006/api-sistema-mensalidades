import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import { AppError } from "../errors/appError";
import { formatZodIssues } from "../utils/formatZodIssues";

export const validateBody = (schema: ZodType) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new AppError(
            "Dados inválidos no corpo da requisição.",
            400,
            "VALIDACAO_BODY",
            formatZodIssues(error.issues, "body")
          )
        );
      }

      return next(error);
    }
  };
