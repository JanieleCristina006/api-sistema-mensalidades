import { z } from "zod";

export const createAdminSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "O nome precisa ter pelo menos 3 caracteres")
    .max(100, "O nome precisa ter no maximo 100 caracteres"),
  email: z
    .string()
    .trim()
    .email("Insira um email valido!")
    .max(255, "O email precisa ter no maximo 255 caracteres"),
  senha: z
    .string()
    .min(6, "A senha precisa ter pelo menos 6 caracteres")
    .max(72, "A senha precisa ter no maximo 72 caracteres"),
}).strict();

export type CreateAdminInput = z.infer<typeof createAdminSchema>;
