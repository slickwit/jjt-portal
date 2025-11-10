import { z } from 'zod';

// ----------------------------------------------------------------------

export const assessmentFormSchema = z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['draft', 'scheduled', 'active', 'completed', 'archived']),
    // settings?: Record<string, string>number,
    scheduled_at: z.date(),
    due_at: z.date(),
});
