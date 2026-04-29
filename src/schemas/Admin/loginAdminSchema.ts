import { z } from "zod";

export const loginAdminSchema = z.object({
  email: z.string().trim().email("Insira um email válido."),
  senha: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
});
