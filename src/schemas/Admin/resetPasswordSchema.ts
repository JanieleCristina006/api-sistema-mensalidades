import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, "Token é obrigatório"),
    novaSenha: z
      .string()
      .min(6, "A nova senha precisa ter pelo menos 6 caracteres")
      .max(72, "A nova senha precisa ter no máximo 72 caracteres"),
  })
  .strict();
