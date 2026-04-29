import { z } from "zod";

export const updatePlanSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "O nome do plano precisa ter pelo menos 3 caracteres"),
  preco: z
    .string()
    .trim()
    .min(1, "O preço do plano é obrigatório")
    .regex(/^\d+(\.\d{1,2})?$/, "O preço do plano precisa ser um valor válido"),
});
