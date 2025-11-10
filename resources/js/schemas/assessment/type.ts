import z from 'zod';
import { assessmentFormSchema } from './schema';

// ----------------------------------------------------------------------

export interface Assessment {
    id: number;
    title: string;
    description: string;
    created_by: string;
    status: 'draft' | 'scheduled' | 'active' | 'completed' | 'archived';
    settings?: Record<string, string>;
    scheduled_at: string;
    due_at: string;
}

export type TAssessmentFormSchema = z.infer<typeof assessmentFormSchema>;
