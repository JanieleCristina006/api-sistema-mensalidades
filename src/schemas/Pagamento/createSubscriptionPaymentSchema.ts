import { PaymentMethod } from "@prisma/client";
import { z } from "zod";

export const createSubscriptionPaymentSchema = z.object({
  metodo: z.nativeEnum(PaymentMethod),
  obs: z.string().trim().optional(),
});
