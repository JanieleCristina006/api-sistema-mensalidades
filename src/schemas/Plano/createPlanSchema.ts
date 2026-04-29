import { PlanStatus } from "@prisma/client";
import { z } from "zod";

export const createPlanSchema = z
  .object({
    nome: z
      .string()
      .trim()
      .min(3, "O nome do plano precisa ter pelo menos 3 caracteres")
      .max(100, "O nome do plano precisa ter no máximo 100 caracteres"),
    descricao: z
      .string()
      .trim()
      .min(3, "A descrição do plano precisa ter pelo menos 3 caracteres")
      .max(500, "A descrição do plano precisa ter no máximo 500 caracteres"),
    preco: z
      .string()
      .trim()
      .min(1, "O preço do plano é obrigatório")
      .regex(/^\d+(\.\d{1,2})?$/, "O preço do plano precisa ser um valor válido"),
    status: z.nativeEnum(PlanStatus).optional(),
  })
  .strict();

export type CreatePlanInput = z.infer<typeof createPlanSchema>;
