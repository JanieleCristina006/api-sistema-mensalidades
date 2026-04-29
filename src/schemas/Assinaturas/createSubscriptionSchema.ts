import { z } from "zod";

export const createSubscriptionSchema = z.object({
  id_plano: z.coerce
    .number("ID do plano deve ser um número")
    .int("ID do plano deve ser um número inteiro")
    .positive("ID do plano deve ser maior que zero"),
});
