import { Request, Response, NextFunction } from "express";

export function validaId(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params.id);

  if (!req.params.id) {
    return res.status(400).json({
      error: "Rota sem id!",
    });
  }

  if (isNaN(id)) {
    return res.status(400).json({
      error: "ID inválido",
    });
  }

  return next();
}