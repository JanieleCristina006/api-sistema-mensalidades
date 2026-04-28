import { PlanStatus } from '@prisma/client';
import { z } from 'zod';

export const createPlanSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, 'O nome do plano precisa ter pelo menos 3 caracteres')
    .max(100, 'O nome do plano precisa ter no maximo 100 caracteres'),
  descricao: z
    .string()
    .trim()
    .min(3, 'A descricao do plano precisa ter pelo menos 3 caracteres')
    .max(500, 'A descricao do plano precisa ter no maximo 500 caracteres'),
  preco: z
    .string()
    .trim()
    .min(1, 'O preco do plano e obrigatorio')
    .regex(/^\d+(\.\d{1,2})?$/, 'O preco do plano precisa ser um valor valido'),
  status: z.nativeEnum(PlanStatus).optional(),
}).strict();

export type CreatePlanInput = z.infer<typeof createPlanSchema>;
