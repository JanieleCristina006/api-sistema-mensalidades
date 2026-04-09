import { z } from "zod";
import { PlanStatus } from "@prisma/client";

export const updatePlanStatusSchema = z.object({
  status: z.enum(PlanStatus),

})