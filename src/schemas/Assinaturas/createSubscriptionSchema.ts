import { z } from "zod";

export const createSubscriptionSchema = z.object({
  id_plano: z
    .number("ID do plano deve ser um numero")
    .int("ID do plano deve ser um numero inteiro")
    .positive("ID do plano deve ser maior que zero"),
});
