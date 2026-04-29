import { ZodIssue } from "zod";
import { AppErrorDetail } from "../errors/appError";

export function formatZodIssues(
  issues: ZodIssue[],
  fallbackField: string
): AppErrorDetail[] {
  return issues.map((issue) => ({
    campo: issue.path.length ? issue.path.join(".") : fallbackField,
    mensagem: issue.message,
  }));
}
