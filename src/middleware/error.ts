
import { Request, Response, NextFunction } from "express"

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  return res.status(400).json({
    error: err.message
  })
}