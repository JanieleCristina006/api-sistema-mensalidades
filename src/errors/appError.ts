export type AppErrorDetail = {
  campo?: string;
  mensagem: string;
};

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: AppErrorDetail[];

  constructor(
    message: string,
    statusCode = 400,
    code = "REQUISICAO_INVALIDA",
    details?: AppErrorDetail[]
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    Object.setPrototypeOf(this, AppError.prototype);
  }
}
