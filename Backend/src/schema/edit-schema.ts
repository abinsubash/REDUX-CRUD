import { z } from 'zod';

export const updateSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
        age: z.coerce.number().int().min(5, "Age must be a positive number"),
});

export default updateSchema