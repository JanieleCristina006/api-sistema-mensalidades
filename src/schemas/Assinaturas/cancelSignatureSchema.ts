import { SignatureStatus } from '@prisma/client';
import { z } from 'zod';

export const cancelSignatureSchema = z.object({
    status: z.enum(SignatureStatus),
});
