import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import { AppError } from "../errors/appError";
import { formatZodIssues } from "../utils/formatZodIssues";

export const validateQuery = (schema: ZodType) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.query = (await schema.parseAsync(req.query)) as Request["query"];
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new AppError(
            "Filtros inválidos na query string.",
            400,
            "VALIDACAO_QUERY",
            formatZodIssues(error.issues, "query")
          )
        );
      }

      return next(error);
    }
  };
