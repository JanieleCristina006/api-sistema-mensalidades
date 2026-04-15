import { z } from "zod";

export const idSchema = z.object({
  id: z.coerce
    .number("ID deve ser um número")
    .int("ID deve ser um número inteiro")
    .positive("ID deve ser maior que zero"),
});
