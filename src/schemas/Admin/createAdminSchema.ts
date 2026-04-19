import { z } from "zod";

export const createAdminSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "O nome precisa ter pelo menos 3 caracteres"),
  email: z
    .string()
    .trim()
    .email("Insira um email válido!"),
  senha: z
    .string()
    .min(6, "A senha precisa ter pelo menos 6 caracteres"),
});
