import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

export const validateParams = (schema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedParams = await schema.parseAsync(req.params);
      req.params = parsedParams as Request["params"];
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Erro validação",
          details: error.issues.map((issue) => ({
            campo: issue.path.join("."),
            mensagem: issue.message,
          })),
        });
      }

      return res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  };
