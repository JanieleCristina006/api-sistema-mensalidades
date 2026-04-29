import { z } from "zod";

export const updatedClientSchema = z.object({
  nome: z.string().min(3, "O nome precisa ter pelo menos 3 caracteres"),
  email: z.string().email("Insira um email válido."),
  cpf: z.string().regex(/^\d{11}$/, "CPF deve ter 11 dígitos"),
  telefone: z
    .string()
    .regex(/^(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/, "Telefone inválido"),
});
