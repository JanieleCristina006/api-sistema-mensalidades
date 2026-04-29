import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import { AppError } from "../errors/appError";
import { formatZodIssues } from "../utils/formatZodIssues";

export const validateParams = (schema: ZodType) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsedParams = await schema.parseAsync(req.params);
      req.params = parsedParams as Request["params"];
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new AppError(
            "Parâmetros inválidos na URL.",
            400,
            "VALIDACAO_PARAMS",
            formatZodIssues(error.issues, "params")
          )
        );
      }

      return next(error);
    }
  };
