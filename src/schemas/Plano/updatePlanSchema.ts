import { PlanStatus } from '@prisma/client';
import { z } from 'zod';

export const createPlanoSchema = z.object({
  body: z.object({
    nome: z
      .string()
      .min(3, 'O nome do plano precisa ter pelo menos 3 caracteres'),
    preco: z
      .string()
      .trim()
      .min(1, 'O preco do plano e obrigatorio'),
    status: z.nativeEnum(PlanStatus).optional(),
  }),
  query: z.object({}),
  params: z.object({}),
});
