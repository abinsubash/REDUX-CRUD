import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string()
        .email("Invalid email format")
        .min(5, "Email must be at least 5 characters")
        .max(50, "Email cannot exceed 50 characters"),

    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
});

export default loginSchema