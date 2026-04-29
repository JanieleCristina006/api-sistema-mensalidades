
import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { Prisma } from "@prisma/client";
import { AppError, AppErrorDetail } from "../errors/appError";

type ErrorResponse = {
  error: string;
  code?: string;
  details?: AppErrorDetail[];
};

function fieldName(field: unknown) {
  if (Array.isArray(field)) {
    return field.join(", ");
  }

  if (typeof field === "string" && field.trim()) {
    return field;
  }

  return "campo informado";
}

function prismaErrorToResponse(err: Prisma.PrismaClientKnownRequestError) {
  if (err.code === "P2002") {
    const field = fieldName(err.meta?.target);

    return {
      statusCode: 409,
      body: {
        error: `O valor informado para ${field} já está cadastrado.`,
        code: "REGISTRO_DUPLICADO",
      },
    };
  }

  if (err.code === "P2003") {
    return {
      statusCode: 400,
      body: {
        error:
          "Não foi possível concluir a ação por causa de um relacionamento inválido ou dependente.",
        code: "RELACIONAMENTO_INVALIDO",
      },
    };
  }

  if (err.code === "P2025") {
    return {
      statusCode: 404,
      body: {
        error: "Registro não encontrado para concluir a ação solicitada.",
        code: "REGISTRO_NAO_ENCONTRADO",
      },
    };
  }

  return {
    statusCode: 400,
    body: {
      error: `Erro do banco de dados (${err.code}): ${err.message}`,
      code: "ERRO_BANCO_DADOS",
    },
  };
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    const body: ErrorResponse = {
      error: err.message,
      code: err.code,
    };

    if (err.details) {
      body.details = err.details;
    }

    return res.status(err.statusCode).json(body);
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "Arquivo muito grande. O tamanho máximo permitido é 5MB.",
        code: "ARQUIVO_MUITO_GRANDE",
      });
    }

    return res.status(400).json({
      error: `Falha no upload: ${err.message}`,
      code: "UPLOAD_INVALIDO",
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const { statusCode, body } = prismaErrorToResponse(err);
    return res.status(statusCode).json(body);
  }

  const message =
    err instanceof Error && err.message
      ? err.message
      : "Falha sem mensagem detalhada. Consulte os logs da aplicação.";

  console.error(err);

  return res.status(500).json({
    error: message,
    code: "ERRO_NAO_MAPEADO",
  });
}
