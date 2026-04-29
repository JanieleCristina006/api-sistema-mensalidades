import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/appError";

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (req.method === "GET") {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(
      new AppError(
        "Token de autenticação não enviado.",
        401,
        "TOKEN_NAO_INFORMADO"
      )
    );
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(
      new AppError(
        "Formato do token inválido. Use Authorization: Bearer <token>.",
        401,
        "TOKEN_FORMATO_INVALIDO"
      )
    );
  }

  const secretKey = process.env.JWT_SECRET;

  if (!secretKey) {
    return next(
      new AppError(
        "JWT_SECRET não definido no ambiente.",
        500,
        "CONFIGURACAO_AUSENTE"
      )
    );
  }

  try {
    jwt.verify(token, secretKey);
    return next();
  } catch {
    return next(
      new AppError("Token inválido ou expirado.", 401, "TOKEN_INVALIDO")
    );
  }
}
